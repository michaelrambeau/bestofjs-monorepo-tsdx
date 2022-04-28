type SnapshotMonth = {
  year: number;
  month: number;
};
type SnapshotDay = SnapshotMonth & {
  day: number;
};
type Snapshot = SnapshotDay & {
  stars: number;
};
