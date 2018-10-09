import { NgModule } from '@angular/core';

import { XtForDirective } from './directives';

const declarations = [
   XtForDirective
];

@NgModule({
   imports      : [],
   declarations : declarations,
   exports      : declarations
})
export class NgExtrasModule {
}
