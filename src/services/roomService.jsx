import api from "./api";

const getRoomTypes = () => api.get("/room-types");
const getRoomTypesSearch = (keyword, sort, page) =>
    api.get("/room-types/search", { params: { keyword, sort, page } });

const getAvailableRooms = (checkIn, checkOut, typeId) => {
    let url = `/bookings/available-rooms?check_in=${checkIn}&check_out=${checkOut}`;
    if (typeId) {
        url += `&room_type_id=${typeId}`;
    }
    return api.get(url);
};

export const roomService = {
    getRoomTypes,
    getAvailableRooms,
    getRoomTypesSearch,
};