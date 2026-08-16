# Analytics and Observability

## Product Analytics

Centralize analytics behind an interface such as:

```ts
analytics.track('unit_viewed', context);
```

Do not scatter vendor-specific SDK calls through presentation components.

Useful event categories:

- city_selected
- district_selected
- project_viewed
- project_saved
- experience_entered
- unit_viewed
- unit_saved
- compare_added
- comparison_opened
- enquiry_started
- enquiry_submitted
- sales_session_started
- sales_session_completed

## Privacy

Avoid collecting data "because we can".

Every event should have a product/operational purpose.

## Technical Observability

For production readiness plan for:

- structured logs
- frontend error reporting
- API error telemetry
- performance/web-vitals monitoring
- viewer load time
- viewer failure rate
- asset failure rate
- trace/correlation identifiers where useful

## Operational Metrics

Potential metrics:

- API latency/error rate
- route load performance
- viewer startup duration
- deep-zoom tile failures
- 3D asset load duration
- active sessions
- enquiry conversion funnel

Do not introduce enterprise observability infrastructure in the prototype unless deployment already requires it.
