import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

class TelemetryService {
  private static instance: TelemetryService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  init() {
    if (this.isInitialized) return;

    // Initialize RUM for tracking user performance and usage
    // Note: In a production environment, these values would come from environment variables.
    // We use placeholders if not defined to ensure the code is functional.
    datadogRum.init({
      applicationId: 'b4144415-9ec8-4f37-99cf-43f5b73071fd',
      clientToken: 'puba2f997bab1f25ae0b3f4a64f572059ec',
      site: 'datadoghq.com',
      service: 'idea-2-reality-frontend',
      env: 'production',
      version: '1.2.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // Initialize Logs for tracking technical metrics like API latency and errors
    datadogLogs.init({
      clientToken: 'puba2f997bab1f25ae0b3f4a64f572059ec',
      site: 'datadoghq.com',
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
      service: 'idea-2-reality-api',
      env: 'production'
    });

    this.isInitialized = true;
    this.logEvent('app_start', { timestamp: new Date().toISOString() });
    console.debug("[Telemetry] System initialized and connected to Datadog.");
  }

  logEvent(name: string, attributes: Record<string, any> = {}) {
    datadogRum.addAction(name, attributes);
    datadogLogs.logger.info(`Event: ${name}`, attributes);
  }

  trackGeminiMetric(model: string, latency: number, status: 'success' | 'error', details: Record<string, any> = {}) {
    const metricData = {
      model,
      latency_ms: Math.round(latency),
      status,
      ...details
    };

    // Send to Datadog Logs (which fuels the dashboard)
    datadogLogs.logger.info('Gemini API Metric', metricData);

    // Send to RUM as a custom action for frontend-driven analytics
    datadogRum.addAction('gemini_api_call', metricData);

    // Console output for developer visibility
    if (status === 'error') {
      console.error(`[Telemetry] Gemini Error | Latency: ${latency}ms | Model: ${model}`, details);
    } else {
      console.debug(`[Telemetry] Gemini Success | Latency: ${latency}ms | Model: ${model}`);
    }
  }

  reportRuntimeError(error: Error, context: string) {
    datadogLogs.logger.error(`Runtime Error in ${context}`, {
      message: error.message,
      stack: error.stack,
      context
    });
  }
}

export const telemetry = TelemetryService.getInstance();