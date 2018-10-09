import {
   Directive,
   DoCheck,
   EmbeddedViewRef,
   Input,
   isDevMode,
   IterableChangeRecord,
   IterableChanges,
   IterableDiffer,
   IterableDiffers,
   NgIterable,
   TemplateRef,
   TrackByFunction,
   ViewContainerRef
} from '@angular/core';

export class XtForOfContext<T> {
   constructor(
      public $implicit : T, public xtForOf : NgIterable<T>, public index : number,
      public count : number)
   {
   }

   get first() : boolean
   {
      return this.index === 0;
   }

   get last() : boolean
   {
      return this.index === this.count - 1;
   }

   get even() : boolean
   {
      return this.index % 2 === 0;
   }

   get odd() : boolean
   {
      return !this.even;
   }
}

@Directive({selector : '[xtFor][xtForOf]'})
export class XtForDirective<T> implements DoCheck {

   private _xtForOfDirty : boolean = true;
   private _differ : IterableDiffer<T> | null = null;
   // TODO(issue/24571): remove '!'.

   private _trackByFn ! : TrackByFunction<T>;

   constructor(private _viewContainer : ViewContainerRef,
               private _template : TemplateRef<XtForOfContext<T>>,
               private _differs : IterableDiffers)
   {
   }

   get xtForTrackBy() : TrackByFunction<T>
   {
      return this._trackByFn;
   }

   @Input()
   set xtForTrackBy(fn : TrackByFunction<T>)
   {
      if (isDevMode() && fn != null && typeof fn !== 'function') {
         // TODO(vicb): use a log service once there is a public one available
         if (<any>console && <any>console.warn) {
            console.warn(
               `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
               `See https://angular.io/docs/ts/latest/api/common/index/XtFor-directive.html#!#change-propagation for more information.`);
         }
      }
      this._trackByFn = fn;
   }

   // TODO(issue/24571): remove '!'.
   private _xtForOf ! : NgIterable<T>;

   @Input()
   set xtForOf(xtForOf : NgIterable<T>)
   {
      this._xtForOf = xtForOf;
      this._xtForOfDirty = true;
   }

   @Input()
   set xtForTemplate(value : TemplateRef<XtForOfContext<T>>)
   {
      // TODO(TS2.1): make TemplateRef<Partial<XtForRowOf<T>>> once we move to TS v2.1
      // The current type is too restrictive; a template that just uses index, for example,
      // should be acceptable.
      if (value) {
         this._template = value;
      }
   }

   ngDoCheck() : void
   {
      if (this._xtForOfDirty) {
         this._xtForOfDirty = false;
         // React on xtForOf changes only once all inputs have been initialized
         const value = this._xtForOf;
         if (!this._differ && value) {
            try {
               this._differ = this._differs.find(value).create(this.xtForTrackBy);
            } catch (e) {
               throw new Error(
                  `Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'
                  . XtFor only supports binding to Iterables such as Arrays.`);
            }
         }
      }
      if (this._differ) {
         const changes = this._differ.diff(this._xtForOf);
         if (changes) this._applyChanges(changes);
      }
   }

   private _applyChanges(changes : IterableChanges<T>)
   {
      const insertTuples : RecordViewTuple<T>[] = [];
      changes.forEachOperation(
         (item : IterableChangeRecord<any>, adjustedPreviousIndex : number, currentIndex : number) => {
            if (item.previousIndex == null) {
               const view = this._viewContainer.createEmbeddedView(
                  this._template, new XtForOfContext<T>(null !, this._xtForOf, -1, -1), currentIndex);
               const tuple = new RecordViewTuple<T>(item, view);
               insertTuples.push(tuple);
            } else if (currentIndex == null) {
               this._viewContainer.remove(adjustedPreviousIndex);
            } else {
               const view = this._viewContainer.get(adjustedPreviousIndex) !;
               this._viewContainer.move(view, currentIndex);
               const tuple = new RecordViewTuple(item, <EmbeddedViewRef<XtForOfContext<T>>>view);
               insertTuples.push(tuple);
            }
         });

      for (let i = 0; i < insertTuples.length; i++) {
         this._perViewChange(insertTuples[i].view, insertTuples[i].record);
      }

      for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
         const viewRef = <EmbeddedViewRef<XtForOfContext<T>>>this._viewContainer.get(i);
         viewRef.context.index = i;
         viewRef.context.count = ilen;
         viewRef.context.xtForOf = this._xtForOf;
      }

      changes.forEachIdentityChange((record : any) => {
         const viewRef =
            <EmbeddedViewRef<XtForOfContext<T>>>this._viewContainer.get(record.currentIndex);
         viewRef.context.$implicit = record.item;
      });
   }

   private _perViewChange(view : EmbeddedViewRef<XtForOfContext<T>>, record : IterableChangeRecord<any>)
   {
      view.context.$implicit = record.item;
   }
}

class RecordViewTuple<T> {
   constructor(public record : any,
               public view : EmbeddedViewRef<XtForOfContext<T>>)
   {
   }
}

export function getTypeNameForDebugging(type : any) : string
{
   return type['name'] || typeof type;
}
