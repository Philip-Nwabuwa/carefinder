import { fetchHospitalsFromFirestore } from "@/app/lib/firestore";
import { deleteHospitalFromFirestore } from "@/app/lib/firestore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface HospitalState {
  hospitals: Hospital[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HospitalState = {
  hospitals: [],
  status: "idle",
  error: null,
};

export const deleteHospital = createAsyncThunk(
  "hospitals/deleteHospital",
  async (hospitalId: string) => {
    await deleteHospitalFromFirestore(hospitalId);
  }
);

export const fetchHospitals = createAsyncThunk<Hospital[]>(
  "hospitals/fetchHospitals",
  async () => {
    const hospitals = await fetchHospitalsFromFirestore();
    return hospitals.map((hospital) => ({
      id: hospital.id,
      phone: hospital.phone,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      website: hospital.website,
      description: hospital.description,
    }));
  }
);

const hospitalsSlice = createSlice({
  name: "hospitals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hospitals = action.payload as Hospital[];
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.hospitals = state.hospitals.filter(
          (hospital) => hospital.id !== action.meta.arg
        );
      });
  },
});

export default hospitalsSlice.reducer;
