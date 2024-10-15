'use client'
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await fetch('/api/role');
                const data = await res.json();
                if (res.ok) {
                    setRoles(data);
                } else {
                    console.error('Error obteniendo los roles');
                }
            } catch (error) {
                console.error('Error en la solicitud', error);
            }
        };

        fetchRoles();
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    roleId: parseInt(data.roleId)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                router.push('/auth/login');
            } else {
                const errorData = await res.json();
                console.error("Error:", errorData);
            }

        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" {...register("username", { required: { value: true, message: 'El username es requerido' } })} />
                {errors.username && <span className="text-red-500">{errors.username.message}</span>}

                <input type="email" {...register("email", { required: { value: true, message: 'El email es requerido' } })} />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                <input type="password" {...register("password", { required: { value: true, message: 'La contraseña es requerida' } })} />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                <input type="text" {...register("nombre", { required: { value: true, message: 'El nombre es requerido' } })} />
                {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}

                <input type="text" {...register("apellido", { required: { value: true, message: 'El apellido es requerido' } })} />
                {errors.apellido && <span className="text-red-500">{errors.apellido.message}</span>}

                <input type="text" {...register("telefono", { required: { value: true, message: 'El telefono es requerido' } })} />
                {errors.telefono && <span className="text-red-500">{errors.telefono.message}</span>}

                <input type="text" {...register("direccion", { required: { value: true, message: 'La dirección es requerida' } })} />
                {errors.direccion && <span className="text-red-500">{errors.direccion.message}</span>}

                {/* Dropdown para seleccionar el rol */}
                <div className="mb-4">
                    <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select required id="roleId" name="roleId" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("roleId", { required: { value: true, message: 'El rol es requerido' } })}>
                        {roles.map((role) => (
                            <option key={role.IdRole} value={role.IdRole}>
                                {role.Descripcion}
                            </option>
                        ))}
                    </select>
                    {errors.roleId && <span className="text-red-500">{errors.roleId.message}</span>}
                </div>

                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default RegisterPage;
