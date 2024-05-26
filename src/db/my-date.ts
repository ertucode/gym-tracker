import {
	ColumnBuilderBaseConfig,
	entityKind,
	HasDefault,
	sql,
	MakeColumnConfig,
	ColumnBuilderRuntimeConfig,
	ColumnBaseConfig,
} from "drizzle-orm";
import {
	SQLiteBaseIntegerBuilder,
	AnySQLiteTable,
	SQLiteBaseInteger,
} from "drizzle-orm/sqlite-core";

export class SQLiteTimestampBuilder<
	T extends ColumnBuilderBaseConfig<"date", "SQLiteTimestamp">,
> extends SQLiteBaseIntegerBuilder<T, { mode: "timestamp" | "timestamp_ms" }> {
	static readonly [entityKind]: string = "SQLiteTimestampBuilder";

	constructor(name: T["name"], mode: "timestamp" | "timestamp_ms") {
		super(name, "date", "SQLiteTimestamp");
		this.config.mode = mode;
	}

	build<TTableName extends string>(
		table: AnySQLiteTable<{ name: TTableName }>,
	): SQLiteTimestamp<MakeColumnConfig<T, TTableName>> {
		return new SQLiteTimestamp<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		);
	}
}

export class SQLiteTimestamp<
	T extends ColumnBaseConfig<"date", "SQLiteTimestamp">,
> extends SQLiteBaseInteger<T, { mode: "timestamp" | "timestamp_ms" }> {
	static readonly [entityKind]: string = "SQLiteTimestamp";

	readonly mode: "timestamp" | "timestamp_ms" = this.config.mode;

	override mapFromDriverValue(value: number): Date {
		if (this.config.mode === "timestamp") {
			return new Date(value * 1000);
		}
		return new Date(value);
	}

	override mapToDriverValue(value: Date): number {
		const unix = value.getTime();
		if (this.config.mode === "timestamp") {
			return Math.floor(unix / 1000);
		}
		return unix;
	}
}
