import { StatisticalBlock } from "../Blocks/StatisticalBlock";
import { Database } from "../Database";
import { UsedCountVisitor } from "../Blocks/UsedCountVisitor";
import { StatisticalRegionVisitor } from "../Blocks/StatisticalRegionVisitor";
import { RecordVisitor } from "../Blocks/RecordVisitor";
import { RecordRegionVisitor } from "../Blocks/RecordRegionVisitor";
import { Type } from "../../../System/Type";
export class MetaBlock {
    public Set(address?: number, recordSize?: number): MetaBlock | StatisticalBlock {
        return {} as any;
    }
    public SetByRecordAddress(recordAddress?: number, recordSize?: number): MetaBlock | StatisticalBlock {
        return {} as any;
    }
    public SetAddress(address?: number, recordSize?: number, blockSize?: number): void {
        return {} as any;
    }
    public Initialize(table?: Database): Promise<void> {
        return {} as any;
    }
    public AllocateRecord(table?: Database): Promise<any> {
        return {} as any;
    }
    public UnuseByAddress(db?: Database, address?: number): Promise<void> {
        return {} as any;
    }
    public ContainsUnused(db?: Database): Promise<boolean> {
        return {} as any;
    }
    public GetUsedIndexs(db?: Database): Promise<number[]> {
        return {} as any;
    }
    public GetUsedCount(db?: Database): Promise<number> {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public constructor() {
    }
    public get UsedCountAddress(): number {
        return {} as any;
    }
    public get StatisticalRegionAddress(): number {
        return {} as any;
    }
    public get StatisticalRegionSize(): number {
        return {} as any;
    }
    public get CacheSize(): number {
        return {} as any;
    }
    public get UsedCountVisitor(): UsedCountVisitor {
        return {} as any;
    }
    public get StatisticalRegionVisitor(): StatisticalRegionVisitor {
        return {} as any;
    }
    public get Address(): number {
        return {} as any;
    }
    public get RecordSize(): number {
        return {} as any;
    }
    public get BlockSize(): number {
        return {} as any;
    }
    public get RecordCount(): number {
        return {} as any;
    }
    public get FirstRecordAddress(): number {
        return {} as any;
    }
    public set FirstRecordAddress(value: number) {
    }
    public get RecordVisitor(): RecordVisitor {
        return {} as any;
    }
    public get RecordRegionVisitor(): RecordRegionVisitor {
        return {} as any;
    }
}