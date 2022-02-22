import React, { useContext, useMemo, useState } from 'react';
import Select from 'react-select';
import { ClosetItem } from '~/components/closet/ClosetItem';
import { ClosetContext } from '~/components/context/ClosetContext';
import { ClosetTokenWithMeta, ReactSelectOption } from '~/types';
import { titleCase } from '~/utils/string';
import type { MouseEvent } from 'react';
import {
  GetClosetDataSubscription,
  GetRatsSubscription,
} from '~/schema/generated';

export const ClosetItemList = () => {
  enum FilterShowEnum {
    All = 'all',
    Owned = 'owned',
    Unowned = 'unowned',
  }
  enum FilterTypeEnum {
    All = 'all',
    Background = 'background',
    Tail = 'tail',
    Ears = 'ears',
    Pet = 'pet',
    Hand = 'hand',
    Color = 'color',
    Markings = 'markings',
    Head = 'head',
    Generation = 'generation',
    Snout = 'snout',
    Torso = 'torso',
    Shirt = 'shirt',
    Eyes = 'eyes',
    Glasses = 'glasses',
    Accessory = 'accessory',
    Hat = 'hat',
  }
  const { loading, closetPieces, sponsoredPieces } = useContext(ClosetContext);
  const [filterShow, setFilterShow] = useState<FilterShowEnum>(
    FilterShowEnum.All,
  );
  const [filterType, setFilterType] = useState<FilterTypeEnum>(
    FilterTypeEnum.All,
  );

  const activeButton =
    'text-white bg-purple-700 border-purple-900 hover:bg-purple-800 hover:text-white';
  const inactiveButton =
    'text-purple-700 bg-white border-gray-400 hover:bg-purple-800 hover:text-white hover:border-purple-900';

  const clickFilterShow = (event: MouseEvent) => {
    let target = event.target as HTMLButtonElement;
    let newFilterShow =
      (target.dataset.filterShow?.toString() as FilterShowEnum) ||
      FilterShowEnum.All;
    if (filterShow !== newFilterShow) {
      setFilterShow(newFilterShow);
    }
  };

  const filterShowMethod = (
    piece: typeof closetPieces[0],
    state: FilterShowEnum,
  ) => {
    switch (state) {
      case FilterShowEnum.Unowned:
        return (piece.owned.aggregate?.sum?.amount ?? 0) > 0 ? false : true;
      case FilterShowEnum.Owned:
        return (piece.owned.aggregate?.sum?.amount ?? 0) > 0 ? true : false;
      case FilterShowEnum.All:
      default:
        return true;
    }
  };

  const piecesByType = useMemo(
    () =>
      closetPieces.reduce((acc, curr) => {
        const pieceType = curr.piece_type;
        if (pieceType) {
          return {
            ...acc,
            [pieceType]: [...(acc[pieceType] ?? []), curr],
          };
        }
        return acc;
      }, {} as Record<string, typeof closetPieces>),
    [closetPieces],
  );

  const pieceTypes = useMemo(() => {
    let pieceTypes = Object.keys(piecesByType).sort();
    let pieceTypeOptions: ReactSelectOption[] = pieceTypes.map((pieceType) => ({
      label: titleCase(pieceType),
      value: pieceType,
    }));
    return pieceTypeOptions;
  }, [piecesByType]);

  return (
    <div>
      {!loading.data && (
        <div className='filters flex space-x-4'>
          <div className='inline-flex rounded-md shadow-sm' role='group'>
            <button
              onClick={clickFilterShow}
              data-filter-show={FilterShowEnum.All}
              type='button'
              className={
                'px-4 py-2 text-sm font-medium border rounded-l-lg ' +
                (filterShow === FilterShowEnum.All
                  ? activeButton
                  : inactiveButton)
              }>
              Show All
            </button>
            <button
              onClick={clickFilterShow}
              data-filter-show={FilterShowEnum.Owned}
              type='button'
              className={
                'px-4 py-2 text-sm font-medium border ' +
                (filterShow === FilterShowEnum.Owned
                  ? activeButton
                  : inactiveButton)
              }>
              Show Owned
            </button>
            <button
              onClick={clickFilterShow}
              data-filter-show={FilterShowEnum.Unowned}
              type='button'
              className={
                'px-4 py-2 text-sm font-medium border rounded-r-lg ' +
                (filterShow === FilterShowEnum.Unowned
                  ? activeButton
                  : inactiveButton)
              }>
              Show Un-owned
            </button>
          </div>
          <Select
            className='select-search'
            options={pieceTypes}
            placeholder='What type of piece?'
            onChange={(selected, action) => {
              if (selected) {
                if (typeof selected.value === 'string') {
                  setFilterType(selected.value as FilterTypeEnum);
                } else if (filterType !== FilterTypeEnum.All) {
                  setFilterType(FilterTypeEnum.All);
                }
              } else if (filterType !== FilterTypeEnum.All) {
                setFilterType(FilterTypeEnum.All);
              }
            }}
            isClearable
            isSearchable
          />
        </div>
      )}

      <div
        className={`flex flex-col w-full ${
          loading.data
            ? 'opacity-0 pointer-events-none overflow-hidden'
            : 'opacity-1 pointer-events-auto'
        }`}>
        {Object.values(sponsoredPieces).length > 0 &&
          filterType === FilterTypeEnum.All && (
            <div>
              <h3 className='mt-4 mb-1 text-white bold capitalize text-xl'>
                Sponsored {filterType}
              </h3>
              <p className='text-white text-sm'>
                These pieces are from some of our best friends around the
                internet.
              </p>
              <p className='text-white text-sm mb-4'>
                Want to{' '}
                <a
                  href='https://docs.google.com/forms/d/e/1FAIpQLSf7Sya6kD5V-qGE9R7GIlZ6VC9_xR2EwsGo3VouvHcpCULCRg/viewform'
                  target='_blank'
                  className='underline'
                  rel='noreferrer'>
                  add a branded piece
                </a>{' '}
                to the closet?
              </p>

              <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {sponsoredPieces
                  .filter((a) => filterShowMethod(a, filterShow))
                  .map((piece) => (
                    <ClosetItem
                      key={piece.id.toString()}
                      piece={piece}
                      pieceType={
                        piece.piece_type as keyof GetRatsSubscription['rats'][0]
                      }
                    />
                  ))}
              </div>
            </div>
          )}
        {Object.entries(piecesByType).map(([pieceType, pieces]) =>
          filterType === FilterTypeEnum.All || filterType === pieceType ? (
            <div key={pieceType}>
              <h3 className='mt-4 mb-1 text-white bold capitalize text-xl'>
                {pieceType}
              </h3>

              <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {pieces
                  .filter((a) => filterShowMethod(a, filterShow))
                  .map((piece) => (
                    <ClosetItem
                      key={piece.id.toString()}
                      piece={piece}
                      pieceType={
                        piece.piece_type as keyof GetRatsSubscription['rats'][0]
                      }
                    />
                  ))}
              </div>
            </div>
          ) : (
            ''
          ),
        )}
      </div>
    </div>
  );
};
