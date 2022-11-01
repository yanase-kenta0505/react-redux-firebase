import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface USER {
  displayName: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", displayName: "" },
  },

  reducers: {
    //action.payloadにfirebaseから取得したユーザーの情報を渡す
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = { uid: "", displayName: "" };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

//Reduxのstoreの値をコンポーネントから参照するときに、useSelectorを使用して返すようにする
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
