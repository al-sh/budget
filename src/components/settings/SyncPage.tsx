import { Button } from 'antd';
import React, { useState } from 'react';
import { API_ROUTES } from '../../constants/api-routes';
import { getApi } from '../../services/Api';

const downloadToFile = (content: string, filename: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

const sendFile = async (endpoint: string, file: File) => {
  const formData = new FormData();
  file && formData.append('fileData', file);
  const api = getApi();

  const res = await api.send({
    endpoint: endpoint,
    method: 'POST',
    isFile: true,
    data: formData,
  });
};

const SyncPage: React.FC = () => {
  const [fileToLoad, setFileToLoad] = useState<File | undefined>(undefined);
  const api = getApi();
  const handleSendFile = async () => {
    fileToLoad && (await sendFile(API_ROUTES.SYNC + '/upload/categories', fileToLoad));
  };
  const handleSendAccountsFile = async () => {
    fileToLoad && (await sendFile(API_ROUTES.SYNC + '/upload/accounts', fileToLoad));
  };
  const handleSendTransactionsFile = async () => {
    fileToLoad && (await sendFile(API_ROUTES.SYNC + '/upload/transactions', fileToLoad));
  };

  return (
    <>
      <h2>Синхронизация</h2>
      <input
        type="file"
        id="file"
        name="file"
        onChange={(evt) => {
          if (evt.target.files && evt.target.files[0]) {
            setFileToLoad(evt.target.files[0]);
          }
        }}
      />
      <h3>Категории</h3>
      <div>
        <Button
          onClick={async () => {
            const res = await api.send({
              endpoint: API_ROUTES.SYNC + '/download/categories',
              method: 'GET',
            });
            downloadToFile(JSON.stringify(res as string), 'categories.json', 'text/plain');
          }}
        >
          Выгрузить
        </Button>

        <Button onClick={handleSendFile}>Загрузить</Button>
      </div>
      <h3 style={{ marginTop: 30 }}>Счета</h3>
      <div>
        <Button
          onClick={async () => {
            const res = await api.send({
              endpoint: API_ROUTES.SYNC + '/download/accounts',
              method: 'GET',
            });
            downloadToFile(JSON.stringify(res as string), 'accounts.json', 'text/plain');
          }}
        >
          Выгрузить
        </Button>
        <span>
          <Button onClick={handleSendAccountsFile}>Загрузить</Button>
        </span>
      </div>
      <h3 style={{ marginTop: 30 }}>Транзакции</h3>
      <div>
        <Button
          onClick={async () => {
            const res = await api.send({
              endpoint: API_ROUTES.SYNC + '/download/transactions',
              method: 'GET',
            });
            downloadToFile(JSON.stringify(res as string), 'transactions.json', 'text/plain');
          }}
        >
          Выгрузить
        </Button>
        <Button onClick={handleSendTransactionsFile}>Загрузить</Button>
      </div>
    </>
  );
};

export default SyncPage;
