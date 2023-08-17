import { Button, notification } from 'antd';
import React, { useState } from 'react';
import { API_ROUTES } from '../../constants/api-routes';
import { LocalAccount } from '../../server/types/accounts';
import { LocalCategory } from '../../server/types/categories';
import { SyncSaveResult } from '../../server/types/sync';
import { LocalTransaction } from '../../server/types/transactions';
import { getApi } from '../../services/Api';
import { formatDateTechnical } from '../../utils/format';
import { T2 } from '../_shared/_base/Text';

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

  const handleSaveFromStorage = async () => {
    const storageData = {
      accounts: JSON.parse(localStorage.accounts),
      categories: JSON.parse(localStorage.categories),
      transactions: JSON.parse(localStorage.transactions),
    };
    const res = await api.send<SyncSaveResult, any>({
      endpoint: API_ROUTES.SYNC + '/upload/all/raw',
      method: 'POST',
      data: storageData,
    });

    notification.info({
      message: (
        <div>
          <div>Количество ошибок: {res.errors.length}</div>
          <div>
            <div>
              <T2>Сохранено на бэке:</T2>
            </div>
            <div>
              <div>Счетов: {res.imported?.accounts}</div>
              <div>Категорий: {res.imported?.categories}</div>
              <div>Транзакций: {res.imported?.transactions}</div>
            </div>
          </div>
        </div>
      ),
    });
  };
  const handleAllFile = async () => {
    fileToLoad && (await sendFile(API_ROUTES.SYNC + '/upload/all/file', fileToLoad));
  };

  const handleGetFromBack = async () => {
    const res = await api.send<{ accounts: LocalAccount[]; categories: LocalCategory[]; transactions: LocalTransaction[] }>({
      endpoint: API_ROUTES.SYNC + '/download/all',
      method: 'GET',
    });

    console.log(res);
    localStorage.accounts = JSON.stringify(res.accounts);
    localStorage.categories = JSON.stringify(res.categories);
    localStorage.transactions = JSON.stringify(res.transactions);
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
        <Button onClick={handleSendFile}>Загрузить</Button>
      </div>
      <h3 style={{ marginTop: 30 }}>Счета</h3>
      <div>
        <span>
          <Button onClick={handleSendAccountsFile}>Загрузить</Button>
        </span>
      </div>
      <h3 style={{ marginTop: 30 }}>Транзакции</h3>
      <div>
        <Button onClick={handleSendTransactionsFile}>Загрузить</Button>
      </div>

      <h3 style={{ marginTop: 30 }}>Всё сразу - файлы</h3>
      <div>
        <Button
          onClick={async () => {
            const res = await api.send({
              endpoint: API_ROUTES.SYNC + '/download/all',
              method: 'GET',
            });
            downloadToFile(JSON.stringify(res as string), `budget_${formatDateTechnical(new Date())}.json`, 'text/plain');
          }}
        >
          Выгрузить
        </Button>
        <Button onClick={handleAllFile}>Загрузить</Button>
      </div>

      <h3 style={{ marginTop: 30 }}>Всё сразу - storage</h3>
      <div>
        <Button onClick={handleSaveFromStorage}>Сохранить</Button>
        <Button onClick={handleGetFromBack}>Получить</Button>
      </div>
    </>
  );
};

export default SyncPage;
