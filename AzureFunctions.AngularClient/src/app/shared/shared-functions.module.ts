import { BottomTabsComponent } from './../controls/bottom-tabs/bottom-tabs.component';
import { RightTabsComponent } from 'app/controls/right-tabs/right-tabs.component';
import { SharedModule } from './shared.module';
import { MonacoEditorDirective } from './directives/monaco-editor.directive';
import { FnWriteAccessDirective } from './directives/fn-write-access.directive';
import { EditModeWarningComponent } from './../edit-mode-warning/edit-mode-warning.component';
import { PairListComponent } from './../controls/pair-list/pair-list.component';
import { FunctionKeysComponent } from './../function-keys/function-keys.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        FunctionKeysComponent,
        PairListComponent,
        EditModeWarningComponent,
        FnWriteAccessDirective,
        MonacoEditorDirective,
        RightTabsComponent,
        BottomTabsComponent
        
    ],
    exports: [
        FunctionKeysComponent,
        PairListComponent,
        EditModeWarningComponent,
        FnWriteAccessDirective,
        MonacoEditorDirective,
        RightTabsComponent,
        BottomTabsComponent
    ],
    imports: [
        TranslateModule.forChild(),
        SharedModule
    ]
})
export class SharedFunctionsModule {
}
