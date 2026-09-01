import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { interval } from "rxjs";

@Pipe({
  name: "timeAgo",
  standalone: true
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private subscription: any;

  constructor(private cd: ChangeDetectorRef) {}

  transform(date: Date | string | number): string {
    if (!date) return "";

    const givenDate = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);

    if (!this.subscription) {
      this.subscription = interval(60000).subscribe(() => {
        this.cd.markForCheck();
      });
    }

    if (seconds < 60) {
      return "just now";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return days === 1 ? "a day ago" : `${days} days ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return months === 1 ? "a month ago" : `${months} months ago`;
    }

    const years = Math.floor(months / 12);
    return years === 1 ? "a year ago" : `${years} years ago`;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
