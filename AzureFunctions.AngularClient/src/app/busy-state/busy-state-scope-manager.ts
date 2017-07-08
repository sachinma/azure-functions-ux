import { BusyStateComponent } from './busy-state.component';
import { Subscription as RxSubscription } from 'rxjs/Subscription';

export class BusyStateScopeManager {

  private _busyState: BusyStateComponent;
  private _busyStateKey: string | undefined;
  private _busyStateSubscription: RxSubscription;

  constructor(busyState: BusyStateComponent){
    this._busyState = busyState;
    this._busyStateSubscription = this._busyState.clear.subscribe(event => this._busyStateKey = undefined);
  }

  public setBusy(){
    this._busyStateKey = this._busyState.setScopedBusyState(this._busyStateKey);
  }

  public clearBusy(){
    this._busyState.clearBusyState(this._busyStateKey);
    this._busyStateKey = undefined;
  }

  public dispose(){
    if(this._busyStateSubscription){
      this._busyStateSubscription.unsubscribe();
    }
    this._busyState = undefined;
    this._busyStateKey = undefined;
    this._busyStateSubscription = undefined;
  }

}