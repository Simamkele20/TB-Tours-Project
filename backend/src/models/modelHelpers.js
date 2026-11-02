const mongoose = require("mongoose");

const applyAttributes = (query, attributes) => {
  if (!attributes) return query;

  if (Array.isArray(attributes)) {
    return query.select(attributes.join(" "));
  }

  if (attributes.exclude && Array.isArray(attributes.exclude) && attributes.exclude.length > 0) {
    const excludes = attributes.exclude.map((field) => `-${field}`).join(" ");
    return query.select(excludes);
  }

  return query;
};

const applyOrder = (query, order) => {
  if (!Array.isArray(order) || order.length === 0) {
    return query;
  }

  const sort = {};
  for (const entry of order) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [field, direction] = entry;
    sort[field] = String(direction).toUpperCase() === "DESC" ? -1 : 1;
  }

  if (Object.keys(sort).length > 0) {
    query.sort(sort);
  }

  return query;
};

const applyPagination = (query, offset, limit) => {
  if (Number.isInteger(offset) && offset >= 0) {
    query.skip(offset);
  }

  if (Number.isInteger(limit) && limit > 0) {
    query.limit(limit);
  }

  return query;
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));

const normalizeWhere = (where = {}) => {
  const normalized = { ...where };

  if (normalized.id && !normalized._id) {
    normalized._id = normalized.id;
    delete normalized.id;
  }

  if (normalized._id && typeof normalized._id === "string" && isValidObjectId(normalized._id)) {
    normalized._id = new mongoose.Types.ObjectId(normalized._id);
  }

  return normalized;
};

const buildPopulate = (include = [], includeMap = {}) => {
  const populate = [];

  for (const entry of include) {
    if (!entry || !entry.model || !entry.model.modelName) continue;
    const path = includeMap[entry.model.modelName];
    if (!path) continue;

    const item = { path };
    if (Array.isArray(entry.attributes) && entry.attributes.length > 0) {
      item.select = entry.attributes.join(" ");
    }

    populate.push(item);
  }

  return populate;
};

const attachSequelizeLikeMethods = (schema, includeMap = {}) => {
  schema.virtual("id").get(function idGetter() {
    return this._id.toString();
  });

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString?.() || ret.id;
      delete ret._id;
      return ret;
    },
  });

  schema.methods.update = async function update(values) {
    Object.assign(this, values || {});
    return this.save();
  };

  schema.methods.destroy = async function destroy() {
    return this.deleteOne();
  };

  schema.statics.findByPk = function findByPk(id, options = {}) {
    if (!isValidObjectId(id)) return null;

    let query = this.findById(id);
    query = applyAttributes(query, options.attributes);

    const populate = buildPopulate(options.include, includeMap);
    for (const item of populate) {
      query.populate(item);
    }

    return query.exec();
  };

  schema.statics.findAll = function findAll(options = {}) {
    const where = normalizeWhere(options.where || {});
    let query = this.find(where);

    query = applyAttributes(query, options.attributes);
    query = applyOrder(query, options.order);
    query = applyPagination(query, options.offset, options.limit);

    const populate = buildPopulate(options.include, includeMap);
    for (const item of populate) {
      query.populate(item);
    }

    return query.exec();
  };

  schema.statics.findOne = function findOneCompat(options = {}) {
    if (options && options.where) {
      const where = normalizeWhere(options.where);
      let query = this.findOne(where);
      query = applyAttributes(query, options.attributes);
      return query.exec();
    }

    return mongoose.Model.findOne.call(this, options);
  };

  schema.statics.findAndCountAll = async function findAndCountAll(options = {}) {
    const where = normalizeWhere(options.where || {});

    const [count, rows] = await Promise.all([
      this.countDocuments(where),
      this.findAll(options),
    ]);

    return { count, rows };
  };

  schema.statics.count = async function countCompat(options = {}) {
    if (options.where) {
      return this.countDocuments(normalizeWhere(options.where));
    }
    return this.countDocuments({});
  };

  schema.statics.findOrCreate = async function findOrCreate({ where, defaults = {} }) {
    const normalizedWhere = normalizeWhere(where || {});
    let existing = await this.findOne(normalizedWhere);
    if (existing) {
      return [existing, false];
    }

    existing = await this.create({ ...defaults, ...where });
    return [existing, true];
  };

  schema.statics.update = async function updateCompat(values = {}, options = {}) {
    const where = normalizeWhere(options.where || {});
    const result = await this.updateMany(where, { $set: values });
    return [result.modifiedCount || 0];
  };

  schema.statics.destroy = async function destroyCompat(options = {}) {
    const where = normalizeWhere(options.where || {});
    const result = await this.deleteMany(where);
    return result.deletedCount || 0;
  };

  schema.statics.truncate = async function truncateCompat() {
    const result = await this.deleteMany({});
    return result.deletedCount || 0;
  };
};

module.exports = {
  attachSequelizeLikeMethods,
  normalizeWhere,
  isValidObjectId,
};
