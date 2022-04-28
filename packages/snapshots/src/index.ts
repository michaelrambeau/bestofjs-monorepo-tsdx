const { DateTime } = require('luxon');

export function findClosestSnapshot(
  snapshots: Snapshot[],
  date: SnapshotDay
): Snapshot {
  console.log(date);
  return snapshots[0];
}

export function getMonthlyDelta(
  snapshots: Snapshot[],
  date: SnapshotMonth
): number | undefined {
  const firstSnapshot = getFirstSnapshotOfTheMonth(snapshots, date);

  let lastSnapshot = getFirstSnapshotOfTheMonth(snapshots, getNextMonth(date));
  if (!lastSnapshot) {
    lastSnapshot = getLastSnapshotOfTheMonth(snapshots, date);
  }
  if (!lastSnapshot || !firstSnapshot) return undefined;
  return lastSnapshot.stars - firstSnapshot.stars;
}

export function getLastSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: SnapshotMonth
): Snapshot | undefined {
  return lastElement(snapshots.filter(snapshot => isSameMonth(snapshot, date)));
}

export function getFirstSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: SnapshotMonth
): Snapshot | undefined {
  return firstElement(
    snapshots.filter(snapshot => isSameMonth(snapshot, date))
  );
}

const firstElement = (array: any[]) => (array.length ? array[0] : undefined);

const lastElement = (array: any[]) =>
  array.length ? array[array.length - 1] : undefined;

export function getMonthlyTrends(snapshots: Snapshot[], date: Date) {
  const months = getLast12Months(date);
  const trends = months
    .map(month => ({
      ...month,
      delta: getMonthlyDelta(snapshots, month),
    }))
    .filter(month => month.delta !== undefined);
  return trends;
}

export function getLast12Months(fromDate: Date): SnapshotMonth[] {
  const { year, month } = normalizeDate(fromDate);
  const finalMonth = getPreviousMonth({ year, month });
  const firstMonth = getNextMonth({
    year: finalMonth.year - 1,
    month: finalMonth.month,
  });

  let currentMonth = firstMonth;
  let months = [];
  for (let index = 0; index < 12; index++) {
    months.push(currentMonth);
    currentMonth = getNextMonth(currentMonth);
  }
  return months;
}

export function getPreviousMonth(date: SnapshotMonth): SnapshotMonth {
  const { year, month } = date;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

export function getNextMonth(date: SnapshotMonth): SnapshotMonth {
  const { year, month } = date;
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

export function normalizeDate(date: Date): SnapshotDay {
  const dt = DateTime.fromJSDate(date).setZone('Asia/Tokyo');
  const year = dt.year;
  const month = dt.month;
  const day = dt.day;
  return { year, month, day };
}

function isSameMonth(date1: SnapshotMonth, date2: SnapshotMonth) {
  return date1.year === date2.year && date1.month === date2.month;
}
