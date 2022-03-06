import { NextPage } from 'next';
import React, { ChangeEventHandler, useState } from 'react';
import { Link } from '~/components/shared/Link';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import { Metadata, OpenSeaAttribute } from '~/types';

const parseHeaders = (data: Record<string, unknown>): Set<string> => {
  return Object.keys(data).reduce((acc, curr) => {
    if (curr !== 'attributes') {
      acc.add(curr);
    } else {
      (data[curr] as OpenSeaAttribute[]).map((a) => {
        if (a.trait_type) {
          acc.add(`${a.trait_type}`);
        }
      });
    }
    return acc;
  }, new Set<string>());
};

const parseRow = (
  data: Record<string, unknown>,
  headers: Set<string>,
): Map<string, unknown> => {
  const map = Object.entries(data).reduce((acc, [key, val]) => {
    if (key !== 'attributes') {
      acc.set(key, val);
    } else {
      (data[key] as OpenSeaAttribute[]).map((a) => {
        if (a.trait_type) {
          acc.set(a.trait_type, a.value);
        }
      });
    }
    return acc;
  }, new Map<string, unknown>());
  Array.from(headers).forEach((h) => {
    if (!map.has(h)) {
      map.set(h, '');
    }
  });
  return map;
};

const OpenSeaThirdWebJsonToCsv: NextPage = () => {
  const [csvHeader, setCsvHeader] = useState<Set<string>>(new Set());
  const [csvRows, setCsvRows] = useState<Map<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseData = (data: Record<string, unknown>) => {
    const headers = parseHeaders(data);
    setCsvHeader(headers);
    setCsvRows((r) => [...r, parseRow(data, headers)]);
  };

  const handleUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setError('');
    const files = Array.from(e.currentTarget.files ?? []);
    const invalidFiles = files.filter((f) => f.type !== 'application/json');
    if (invalidFiles.length > 0) {
      setError(`invalid files: ${invalidFiles.map((f) => f.name).join(', ')}`);
      e.currentTarget.value = '';
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataString = e.target?.result as string;
        const parsedData: Metadata | Array<Metadata> = JSON.parse(dataString);
        if (Array.isArray(parsedData)) {
          parsedData.forEach((d) => parseData(d));
        } else {
          parseData(parsedData);
        }
      };
      reader.readAsText(file);
    });
  };

  const downloadCsv = () => {
    const head = `${Array.from(csvHeader)
      .map((h) => `"${h}"`)
      .join(',')}\n`;
    const rows = csvRows
      .map((row) =>
        Array.from(csvHeader)
          .map((h) => `"${row.get(h) ?? ''}"`)
          .join(','),
      )
      .join('\n');
    const csv = `${head}${rows}`;
    const hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'data.csv';
    hiddenElement.click();
  };

  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800 text-white'>
      <div className='pt-24 mb-8 max-w-lg mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>
          OpenSea(JSON) to thirdweb(CSV) Converter
        </h1>
        <p className="mb-2">
          We&apos;re building tools to help creators create NFTs and build communities. We&apos;re also big fans of thirdweb as a tool for creators to create NFTs on their own contract.
        </p>
        <p>
          You can use the converter to convert the JSON file(s) you export from OpenSea to a .csv that can be imported directly into thirdweb.
        </p>
      </div>
      <div className='flex flex-col max-w-lg mx-auto'>
        <div>
          <input
            type='file'
            name='file[]'
            id='files'
            onChange={handleUpload}
            multiple
          />
          {error && <p className='my-4 text-xl text-red-500'>{error}</p>}
        </div>
        <div>
          <button
            className={`my-4 px-4 py-3 inline-block rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold ${
              !!error ? 'cursor-not-allowed' : ''
            }`}
            onClick={downloadCsv}
            disabled={!!error}>
            Download CSV
          </button>
        </div>
      </div>
      <div className='mb-8 mt-8 max-w-lg mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>
          Resources
        </h1>
        <p className="mb-4">
          Get started with {' '}
          <Link
            href='https://thirdweb.com/'
            className='underline'>
            thirdweb
          </Link>.
        </p>
        <p className="mb-4">
          View OpenSea&apos;s metadata standards to format your JSON files:{' '}
          <Link
            href='https://docs.opensea.io/docs/metadata-standards'
            className='underline'>
            Review
          </Link>.
        </p>
        <div className='mb-8 max-w-lg'>
        <p>
          <iframe
            width="560"
            height="315"
            className="mb-8"
            src="https://www.youtube.com/embed/EvnRI6fsglc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
          </iframe>
        </p>
        </div>
      </div>
    </LayoutNoFooter>
  );
};

export default OpenSeaThirdWebJsonToCsv;
