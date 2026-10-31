import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { Edit, Trash2, Plus, Users, DollarSign } from "lucide-react";
import RoomTypeModal from "../../components/Admin/RoomTypeModal";

const RoomTypes = () => {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        room_name: "",
        price_per_night: "",
        max_guests: "",
        description: "",
        image1: "",
        image2: ""
    });

    const fetchRooms = useCallback(async () => {
        const res = await api.get("/room-types");
        return res.data;
    }, []);

    useEffect(() => {
        let active = true;
        fetchRooms()
            .then((data) => {
                if (active) setRooms(data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải dữ liệu:", error);
            });

        return () => {
            active = false;
        };
    }, [fetchRooms]);

    const refreshRooms = async () => {
        try {
            setRooms(await fetchRooms());
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ room_name: "", price_per_night: "", max_guests: "", description: "", image1: "", image2: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (room) => {
        setEditingId(room.id);
        setFormData(room);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này?")) {
            await api.delete(`/room-types/${id}`);
            await refreshRooms();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEditing = !!editingId;

        try {
            const form = new FormData();

            form.append("room_name", formData.room_name);
            form.append("price_per_night", formData.price_per_night);
            form.append("max_guests", formData.max_guests);
            form.append("description", formData.description || "");

            if (formData.image1 instanceof File) {
                form.append("image1", formData.image1);
            }

            if (formData.image2 instanceof File) {
                form.append("image2", formData.image2);
            }

            if (isEditing) {
                await api.put(
                    `/room-types/${editingId}`,
                    form,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                await api.post(
                    "/room-types",
                    form,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            alert(isEditing ? "Cập nhật thành công" : "Thêm thành công");

            setFormData({
                room_name: "",
                price_per_night: "",
                max_guests: "",
                description: "",
                image1: null,
                image2: null,
            });

            setIsModalOpen(false);
            await refreshRooms();

        } catch (err) {
            console.error(err);
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-0 font-sans text-slate-700">
            <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-lake font-serif tracking-tight">Quản lý loại phòng</h1>
                        <p className="text-slate-500 text-sm mt-1">Danh sách các loại phòng hiện có trong hệ thống</p>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="bg-brand-lake hover:bg-brand-lake-light text-brand-gold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-brand-lake/10 active:scale-95 cursor-pointer font-semibold text-sm"
                    >
                        <Plus size={18} /> Thêm loại phòng
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Hình ảnh</th>
                                <th className="px-6 py-4">Tên phòng</th>
                                <th className="px-6 py-4">Giá / Đêm</th>
                                <th className="px-6 py-4">Sức chứa</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
                            {rooms.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <img
                                            src={r.image1 || "https://via.placeholder.com/60"}
                                            alt="room"
                                            className="w-16 h-10 object-cover rounded-lg shadow-sm border border-slate-100"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-lake font-serif">{r.room_name}</td>
                                    <td className="px-6 py-4 text-brand-gold font-bold text-base">
                                        {Number(r.price_per_night).toLocaleString("vi-VN", {
                                            maximumFractionDigits: 0,
                                        })}đ
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 w-fit px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                                            <Users size={14} className="text-slate-400" /> {r.max_guests} khách
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenEdit(r)}
                                                className="p-2 hover:bg-brand-gold/10 hover:text-brand-gold text-slate-400 rounded-lg transition-colors cursor-pointer"
                                                title="Sửa"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <RoomTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingId}
            />
        </div>
    );
};

export default RoomTypes;