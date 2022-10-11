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
  file && formData.append('myfile', file);
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
  const [isUpload, setIsUpload] = useState(false);
  const api = getApi();
  const handleSendFile = async () => {
    fileToLoad && (await sendFile(API_ROUTES.CATEGORIES + '/upload', fileToLoad));
  };

  return (
    <>
      <h2>Синхронизация</h2>

      <div>
        <Button
          onClick={async () => {
            const res = await api.send({
              endpoint: API_ROUTES.CATEGORIES + '/download',
              method: 'GET',
            });
            downloadToFile(JSON.stringify(res as string), 'categories.json', 'text/plain');
          }}
        >
          Выгрузить категории
        </Button>
        <Button
          onClick={() => {
            setIsUpload(true);
          }}
        >
          Загрузить категории
        </Button>
      </div>
      {isUpload && (
        <div>
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Выберите файл"
            onChange={(evt) => {
              if (evt.target.files && evt.target.files[0]) {
                setFileToLoad(evt.target.files[0]);
              }
            }}
          />
          <Button onClick={handleSendFile}>Отправить файл</Button>
        </div>
      )}
    </>
  );
};

export default SyncPage;
