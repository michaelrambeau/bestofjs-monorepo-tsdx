import {
  findClosestSnapshot,
  getLast12Months,
  getMonthlyTrends,
  getMonthlyDelta,
  getNextMonth,
  getPreviousMonth,
  normalizeDate,
} from '../src/index';
import { remixSnapshots, snapshots } from './sample';

describe('Snapshot date operations', () => {
  it('Should return the last 12 months', () => {
    expect(getLast12Months(new Date('2021-01-04T02:00:00.000Z'))).toEqual([
      { year: 2020, month: 1 },
      { year: 2020, month: 2 },
      { year: 2020, month: 3 },
      { year: 2020, month: 4 },
      { year: 2020, month: 5 },
      { year: 2020, month: 6 },
      { year: 2020, month: 7 },
      { year: 2020, month: 8 },
      { year: 2020, month: 9 },
      { year: 2020, month: 10 },
      { year: 2020, month: 11 },
      { year: 2020, month: 12 },
    ]);
    expect(getLast12Months(new Date('2021-02-04T02:00:00.000Z'))).toEqual([
      { year: 2020, month: 2 },
      { year: 2020, month: 3 },
      { year: 2020, month: 4 },
      { year: 2020, month: 5 },
      { year: 2020, month: 6 },
      { year: 2020, month: 7 },
      { year: 2020, month: 8 },
      { year: 2020, month: 9 },
      { year: 2020, month: 10 },
      { year: 2020, month: 11 },
      { year: 2020, month: 12 },
      { year: 2021, month: 1 },
    ]);
  });
  it('should normalize dates', () => {
    expect(normalizeDate(new Date('2021-01-04T02:00:00.000Z'))).toEqual({
      year: 2021,
      month: 1,
      day: 4,
    });
    expect(normalizeDate(new Date('2021-01-04T22:00:00.000Z'))).toEqual({
      year: 2021,
      month: 1,
      day: 5,
    });
  });
  it('should handle the next month correctly', () => {
    expect(getNextMonth({ year: 2020, month: 11 })).toEqual({
      year: 2020,
      month: 12,
    });
    expect(getNextMonth({ year: 2020, month: 12 })).toEqual({
      year: 2021,
      month: 1,
    });
  });
  it('should handle the previous month correctly', () => {
    expect(getPreviousMonth({ year: 2020, month: 2 })).toEqual({
      year: 2020,
      month: 1,
    });
    expect(getPreviousMonth({ year: 2020, month: 1 })).toEqual({
      year: 2019,
      month: 12,
    });
  });
});

describe('Delta operation', () => {
  it('Should compute monthly deltas', () => {
    const delta = getMonthlyDelta(snapshots, { year: 2020, month: 12 });
    expect(delta).toBe(10);
  });
  // it('Should compute monthly deltas (no data)', () => {
  //   const delta = getMonthlyDelta(snapshots, { year: 2020, month: 1 });
  //   expect(delta).toBe(undefined);
  // });
  it('Should compute monthly even for the current month (no N+1 month)', () => {
    const delta = getMonthlyDelta(snapshots, { year: 2021, month: 1 });
    expect(delta).toBe(28);
  });
  it('Should compute monthly deltas (Remix data)', () => {
    const delta = getMonthlyDelta(remixSnapshots, { year: 2021, month: 11 });
    expect(delta).toBe(3792);
  });
  xit('Should find the closest snapshot', () => {
    const closestSnapshot = findClosestSnapshot(snapshots, {
      year: 2021,
      month: 1,
      day: 1,
    });
    expect(closestSnapshot).toEqual({
      year: 2020,
      month: 12,
      day: 30,
      stars: 100,
    });
  });
});

describe('Monthy trends', () => {
  it('Conpute monthly trends', () => {
    const trends = getMonthlyTrends(
      snapshots,
      new Date('2021-01-04T02:00:00.000Z')
    );
    console.log(trends);
  });
});
