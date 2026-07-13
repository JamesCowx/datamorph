export interface Pipeline { id: string; name: string; stages: Stage[]; source: DataSource; sink: DataSink; schedule?: string; }
export interface Stage { name: string; type: "filter" | "map" | "aggregate" | "join" | "sort"; config: Record<string, any>; }
export interface DataSource { type: "csv" | "json" | "parquet" | "database" | "api"; connection: Record<string, string>; }
export interface DataSink { type: "csv" | "json" | "database" | "s3" | "bigquery"; connection: Record<string, string>; }
export function createPipeline(name: string, source: DataSource, sink: DataSink, stages: Stage[]): Pipeline { return { id: "pipe-" + Date.now(), name, stages, source, sink }; }
export function validatePipeline(pipeline: Pipeline): { valid: boolean; errors: string[] } { const errors: string[] = []; if (!pipeline.source.type) errors.push("Source type is required"); if (!pipeline.sink.type) errors.push("Sink type is required"); return { valid: errors.length === 0, errors }; }
