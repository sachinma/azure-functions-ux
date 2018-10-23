import { ScenarioIds } from './scenario-ids';
import { AzureEnvironment } from './azure.environment';
import { ScenarioCheckInput } from './scenario.models';

export class NationalCloudEnvironment extends AzureEnvironment {
  public static isNationalCloud() {
    return this.isMooncake() || this.isFairFax() || this.isBlackforest();
  }

  public static isFairFax() {
    return false;
  }

  public static isMooncake() {
    return false;
  }

  public static isBlackforest() {
    return false;
  }

  public name = 'NationalCloud';

  constructor() {
    super();
    this.scenarioChecks[ScenarioIds.addResourceExplorer] = {
      id: ScenarioIds.addResourceExplorer,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addPushNotifications] = {
      id: ScenarioIds.addPushNotifications,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addTinfoil] = {
      id: ScenarioIds.addTinfoil,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addLogicApps] = {
      id: ScenarioIds.addLogicApps,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addMsi] = {
      id: ScenarioIds.addMsi,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.deploymentCenter] = {
      id: ScenarioIds.deploymentCenter,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.enableExportToPowerApps] = {
      id: ScenarioIds.enableExportToPowerApps,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addFTPOptions] = {
      id: ScenarioIds.addFTPOptions,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addDiagnoseAndSolve] = {
      id: ScenarioIds.addDiagnoseAndSolve,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.addHTTPSwitch] = {
      id: ScenarioIds.addHTTPSwitch,
      runCheck: () => {
        return { status: 'disabled' };
      },
    };

    this.scenarioChecks[ScenarioIds.onedriveSource] = {
      id: ScenarioIds.onedriveSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.dropboxSource] = {
      id: ScenarioIds.dropboxSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.externalSource] = {
      id: ScenarioIds.externalSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.githubSource] = {
      id: ScenarioIds.githubSource,
      runCheck: () => ({ status: 'disabled' }),
    };
    this.scenarioChecks[ScenarioIds.bitbucketSource] = {
      id: ScenarioIds.bitbucketSource,
      runCheck: () => ({ status: 'disabled' }),
    };
    this.scenarioChecks[ScenarioIds.vstsSource] = {
      id: ScenarioIds.vstsSource,
      runCheck: () => ({ status: 'disabled' }),
    };
  }

  public isCurrentEnvironment(input?: ScenarioCheckInput): boolean {
    return NationalCloudEnvironment.isNationalCloud();
  }
}