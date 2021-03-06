import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {WorkContextType} from '../../features/work-context/work-context.model';
import {T} from 'src/app/t.const';
import {TODAY_TAG} from '../../features/tag/tag.const';
import {Observable, Subscription} from 'rxjs';
import {DialogConfirmComponent} from '../../ui/dialog-confirm/dialog-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import {TagService} from '../../features/tag/tag.service';
import {concatMap, first} from 'rxjs/operators';
import {Tag} from '../../features/tag/tag.model';

@Component({
  selector: 'work-context-menu',
  templateUrl: './work-context-menu.component.html',
  styleUrls: ['./work-context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkContextMenuComponent implements OnDestroy {
  @Input() contextId: string;

  @Input('contextType') set contextTypeSet(v: WorkContextType) {
    this.isForProject = (v === WorkContextType.PROJECT);
    this.base = (this.isForProject)
      ? 'project'
      : 'tag';
  }

  T = T;
  TODAY_TAG_ID = TODAY_TAG.id;
  isForProject: boolean;
  base: string;

  private _subs = new Subscription();

  constructor(
    private _matDialog: MatDialog,
    private _tagService: TagService,
  ) {
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  deleteTag() {
    this._subs.add(this._confirmTagDelete().subscribe(isDelete => {
      if (isDelete) {
        this._tagService.removeTag(this.contextId);
      }
    }));
  }


  private _confirmTagDelete(): Observable<boolean> {
    return this._tagService.getTagById$(this.contextId).pipe(
      first(),
      concatMap((tag: Tag) => this._matDialog.open(DialogConfirmComponent, {
        restoreFocus: true,
        data: {
          message: T.F.TAG.D_DELETE.CONFIRM_MSG,
          translateParams: {tagName: tag.title},
        }
      }).afterClosed()),
    );
  }

}
