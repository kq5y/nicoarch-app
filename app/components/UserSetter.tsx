import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import type { UserType } from "~/@types/models";

type SetterUserStatusEnum = "ready" | "new" | "view";

interface UserSetterProps {
  userId: string | undefined;
  setUserId: (userId: string | undefined) => void;
}

export default function UserSetter(params: UserSetterProps) {
  const [setterUserId, setSetterUserId] = useState<string>("");
  const [setterUserStatus, setSetterUserStatus] =
    useState<SetterUserStatusEnum>("ready");
  const [contentId, setContentId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [registeredVersion, setRegisteredVersion] = useState<string>("");
  const [iconData, setIconData] = useState<File | null>(null);

  const handleSetterUserIdSubmit = async () => {
    setError(null);
    if (!setterUserId) {
      params.setUserId(undefined);
      setSetterUserStatus("ready");
      setUser(null);
      return;
    }
    if (isNaN(Number(setterUserId))) {
      setError("ユーザーIDは数値である必要があります");
      return;
    }
    const response = await fetch(`/api/user?userId=${setterUserId}`);
    if (response.status === 404) {
      setContentId(uuidv4());
      setSetterUserStatus("new");
    } else if (response.status === 200) {
      const { data } = await response.json();
      params.setUserId(data.userId);
      setUser(data);
      setSetterUserStatus("view");
    } else {
      setError("エラーが発生しました");
    }
  };

  const handleNewUserSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("description", description);
      formData.append("registeredVersion", registeredVersion);
      formData.append("iconData", iconData!);
      formData.append("userId", setterUserId);
      formData.append("contentId", contentId);

      const response = await fetch("/api/user", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { data } = await response.json();
        params.setUserId(data.userId);
        setUser(data);
        setSetterUserStatus("view");
        setError(null);
      } else {
        const { meta } = await response.json();
        setError("エラーが発生しました: " + meta.errorCode);
      }
    } catch {
      setError("エラーが発生しました");
    }
  };

  return (
    <div className="border p-4 w-full">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {setterUserStatus === "ready" && (
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="title">
            ユーザーID
          </label>
          <div className="flex items-center w-2/3 gap-2">
            <span>user/</span>
            <input
              className="appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="text"
              name="setterUserId"
              id="setterUserId"
              value={setterUserId}
              onChange={(e) => setSetterUserId(e.target.value)}
            />
            <button
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleSetterUserIdSubmit}
            >
              決定
            </button>
          </div>
        </div>
      )}

      {setterUserStatus === "new" && (
        <div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="nickname">
              名前
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="text"
              name="nickname"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="userDescription">
              説明
            </label>
            <textarea
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              name="description"
              id="userDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label
              className="w-1/3 block font-bold"
              htmlFor="registeredVersion"
            >
              登録バージョン
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="text"
              name="registeredVersion"
              id="registeredVersion"
              value={registeredVersion}
              onChange={(e) => setRegisteredVersion(e.target.value)}
              placeholder="(く)"
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="iconData">
              アイコン
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="file"
              name="iconData"
              id="iconData"
              accept="image/jpeg"
              onChange={(e) => setIconData(e.target.files?.[0] ?? null)}
              required
            />
          </div>
          <div className="flex mb-2">
            <button
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleNewUserSubmit}
            >
              保存
            </button>
          </div>
        </div>
      )}

      {setterUserStatus === "view" && user && (
        <div className="min-w-1/4 h-14 p-2 flex flex-row gap-2 items-center">
          <img
            src={`/contents/image/icon/${user.contentId}.jpg`}
            alt="icon"
            className="w-10 h-10 rounded-full bg-gray-500"
          />
          <div className="flex flex-col">
            <span className="font-bold">{user.nickname}</span>
            <span className="text-sm">user/{user.userId}</span>
          </div>
        </div>
      )}
    </div>
  );
}
