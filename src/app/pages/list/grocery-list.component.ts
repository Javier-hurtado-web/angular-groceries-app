import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Pipe, PipeTransform, SimpleChange} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";
import {Observable, BehaviorSubject} from "rxjs/Rx";

@Pipe({
  name: "itemStatus",
  pure: false // required to update the value when async in nature
})
export class ItemStatusPipe implements PipeTransform {
  transform(items: Array<Grocery>, deleted: boolean) {
    if (!items) return;
    return items.filter((grocery: Grocery) => {
      return grocery.deleted == deleted;
    });
  }
}

@Component({
  selector: "grocery-list",
  inputs: ["showDeleted", "groceries"],
  template: `
    <ul>
      <li *ngFor="let grocery of store.items | async | itemStatus:showDeleted">
        <img
          *ngIf="!grocery.deleted"
          [src]="grocery.done ? './app/assets/images/checked.png' : './app/assets/images/unchecked.png'"
          (click)="toggleDone(grocery)">
        <span
          *ngIf="!grocery.deleted"
          [class.done]="grocery.done">{{ grocery.name }}</span>
        <button
          *ngIf="!grocery.deleted"
          (click)="delete(grocery)">&times;</button>

        <img
          *ngIf="grocery.deleted"
          [src]="grocery.done ? './app/assets/images/selected.png' : './app/assets/images/nonselected.png'"
          (click)="toggleDone(grocery)">
        <span
          *ngIf="grocery.deleted">{{ grocery.name }}</span>
      </li>
    </ul>
  `,
  styleUrls: ["./app/pages/list/grocery-list.css"],
  pipes: [ItemStatusPipe]
})
export class GroceryList {
  @Input() showDeleted: boolean;
  @Output() loaded = new EventEmitter();

  constructor(private store: GroceryStore) {}

  ngOnInit() {
    this.store.load()
      .subscribe(() => this.loaded.emit("loaded"));
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      grocery.done = !grocery.done;
      return;
    }

    this.store.toggleDoneFlag(grocery)
      .subscribe(
        () => {},
        () => { alert("An error occurred managing your grocery list") }
      );
  }

  delete(grocery: Grocery) {
    this.store.setDeleteFlag(grocery)
      .subscribe(
        () => {},
        () => alert("An error occurred while deleting an item from your list.")
      );
  }
}