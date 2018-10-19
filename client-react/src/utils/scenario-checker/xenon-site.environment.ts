import { ScenarioIds } from './scenario-ids';
import { ServerFarmSku } from './ServerFarmSku';
import { ScenarioCheckInput, ScenarioResult, Environment } from './scenario.models';
import i18n from '../../utils/i18n';

export class XenonSiteEnvironment extends Environment {
  public name = 'XenonSite';

  constructor() {
    super();

    const disabledResult: ScenarioResult = {
      status: 'disabled',
      data: null,
    };

    this.scenarioChecks[ScenarioIds.enableTinfoil] = {
      id: ScenarioIds.enableTinfoil,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.dotNetFrameworkSupported] = {
      id: ScenarioIds.dotNetFrameworkSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.platform64BitSupported] = {
      id: ScenarioIds.platform64BitSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.webSocketsSupported] = {
      id: ScenarioIds.webSocketsSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.classicPipelineModeSupported] = {
      id: ScenarioIds.classicPipelineModeSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.defaultDocumentsSupported] = {
      id: ScenarioIds.defaultDocumentsSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.virtualDirectoriesSupported] = {
      id: ScenarioIds.virtualDirectoriesSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.handlerMappingsSupported] = {
      id: ScenarioIds.handlerMappingsSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.remoteDebuggingSupported] = {
      id: ScenarioIds.remoteDebuggingSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.phpSupported] = {
      id: ScenarioIds.phpSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.pythonSupported] = {
      id: ScenarioIds.pythonSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.javaSupported] = {
      id: ScenarioIds.javaSupported,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableAutoSwap] = {
      id: ScenarioIds.enableAutoSwap,
      runCheck: (input: ScenarioCheckInput) => {
        const scenarioResult = this.enableIfStandardOrHigher(input);
        scenarioResult.data = i18n.t('autoSwapUpsell');
        return scenarioResult;
      },
    };
  }

  public isCurrentEnvironment(input?: ScenarioCheckInput): boolean {
    if (input && input.site) {
      return !!input.site.properties && input.site.properties.isXenon;
    }

    return false;
  }

  private enableIfStandardOrHigher(input: ScenarioCheckInput): ScenarioResult {
    const disabled =
      input &&
      input.site &&
      (input.site.properties.sku === ServerFarmSku.free ||
        input.site.properties.sku === ServerFarmSku.shared ||
        input.site.properties.sku === ServerFarmSku.basic);

    return {
      status: disabled ? 'disabled' : 'enabled',
      data: null,
    };
  }
}