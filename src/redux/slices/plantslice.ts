import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import axios from 'axios';
import {Plant} from '../types/Plant';

interface initialStateType {
  loading: 'rejected' | 'pending' | 'fullfilled' | null;
  plants: Array<Plant>;
  error: Error | null | any;
  currentPlant: Plant | null;
  currentPlantImages: string[];
}

const initialState: initialStateType = {
  loading: 'fullfilled',
  plants: [],
  error: null,
  currentPlant: null,
  currentPlantImages: [],
};

export const getAllPlants = createAsyncThunk(
  'get/all',
  async (data, {rejectWithValue}) => {
    try {
      const res = await axios.get('https://plantsapp-s6m7.onrender.com/plants');

      console.log('Plant data fetched', res.data[0].photos[0].imageUrl);
      const plantsWithImages = res.data.map((plant: any) => ({
        ...plant,
        images: plant.photos.map((photo: any) => photo.imageUrl),
      }));
      return plantsWithImages;
    } catch (error: any) {
      rejectWithValue(error);
    }
  },
);

export const getCurrentPlant = createAsyncThunk(
  'get/current',
  async (data: any, {rejectWithValue}) => {
    try {
      // console.log("burda1");
      let {id} = data;
      const res = await axios.get(
        `https://plantsapp-s6m7.onrender.com/plants/${id}`,
      );
      console.log('Current Plant Fetched');
      return await res.data;
    } catch (error: any) {
      rejectWithValue(error);
    }
  },
);

export const deletePlant = createAsyncThunk(
  'delete/plant',
  async (id, {rejectWithValue}) => {
    try {
      const res = await axios.delete(
        `https://plantsapp-s6m7.onrender.com/plants/${id}`,
      );
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const plantslice = createSlice({
  name: 'plantslice',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllPlants.pending, state => {
        state.loading = 'pending';
      })
      .addCase(getAllPlants.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload;
      })
      .addCase(getAllPlants.fulfilled, (state, action) => {
        state.plants = action.payload;
        state.loading = 'fullfilled';
      });

    builder
      .addCase(getCurrentPlant.pending, state => {
        state.loading = 'pending';
      })
      .addCase(getCurrentPlant.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload;
      })
      .addCase(getCurrentPlant.fulfilled, (state, action) => {
        state.currentPlant = action.payload;
        state.currentPlantImages = action.payload.photos.map(
          (photo: any) => photo.imageUrl,
        );
        state.loading = 'fullfilled';
      });

    builder
      .addCase(deletePlant.pending, state => {
        state.loading = 'pending';
      })
      .addCase(deletePlant.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload;
      })
      .addCase(deletePlant.fulfilled, (state, action) => {
        state.loading = 'fullfilled';
        state.plants = state.plants.filter(
          (plant: any) => plant._id !== action.payload,
        );
      });
  },
});

export default plantslice.reducer;
