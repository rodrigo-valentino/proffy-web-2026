import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, CircleAlert, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import avatarImage from "../assets/avatar.svg"
import rocketImage from "../assets/rocket.svg"
import { Button } from "./button"
import {
    createEmptySchedule,
    formatWhatsapp,
    subjects,
    weekDays,
    type TeacherProfile,
} from "../lib/teacher-profile"

const teacherFormSchema = z.object({
    firstName: z.string().trim().min(1, "Informe seu nome."),
    lastName: z.string().trim().min(1, "Informe seu sobrenome."),
    email: z.email("Informe um e-mail válido."),
    whatsapp: z.string().refine(
        (value) => {
            const digits = value.replace(/\D/g, "")
            return digits.length >= 10 && digits.length <= 11
        },
        "Informe um número de WhatsApp com DDD.",
    ),
    biography: z.string().trim().min(1, "Escreva uma breve biografia.").max(300, "A biografia deve ter no máximo 300 caracteres."),
    subject: z.string().min(1, "Selecione uma matéria."),
    avatar: z.string().optional(),
    hourlyRate: z.string().refine(
        (value) => Number(value) > 0,
        "Informe um valor por hora maior que zero.",
    ),
    schedules: z.array(z.object({
        id: z.string(),
        weekDay: z.string().min(1, "Selecione um dia."),
        from: z.string().min(1, "Informe o horário de início."),
        to: z.string().min(1, "Informe o horário de término."),
    })).min(1, "Adicione ao menos um horário disponível."),
}).superRefine((data, context) => {
    data.schedules.forEach((schedule, index) => {
        if (schedule.from && schedule.to && schedule.to <= schedule.from) {
            context.addIssue({
                code: "custom",
                message: "O término deve ser depois do início.",
                path: ["schedules", index, "to"],
            })
        }
    })
})

type TeacherFormValues = z.infer<typeof teacherFormSchema>

type TeacherRegistrationFormProps = {
    profile: TeacherProfile
    isProfile?: boolean
    onSave: (profile: TeacherProfile) => void
}

const fieldClassName = "h-12 w-full rounded-md border border-gray-lines-in-white bg-white-shape px-4 font-poppins-regular text-sm text-text-base outline-none transition focus:border-purple"
const labelClassName = "mb-2 block font-poppins-regular text-xs text-text-complement"

function FieldError({ children }: { children?: string }) {
    if (!children) return null
    return <p className="mt-1 text-xs text-red-600" role="alert">{children}</p>
}

function SectionTitle({ children }: { children: string }) {
    return (
        <h2 className="border-b border-gray-lines-in-white pb-3 font-archivo-semibold text-lg text-text-title">
            {children}
        </h2>
    )
}

export function TeacherRegistrationForm({
    profile,
    isProfile = false,
    onSave,
}: TeacherRegistrationFormProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherFormSchema),
        mode: "onSubmit",
        defaultValues: profile,
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules",
    })
    const biography = useWatch({ control, name: "biography" })
    const firstName = useWatch({ control, name: "firstName" })
    const lastName = useWatch({ control, name: "lastName" })
    const avatar = useWatch({ control, name: "avatar" })

    async function handleAvatarChange(file?: File) {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Selecione um arquivo de imagem.")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setValue("avatar", reader.result, { shouldDirty: true })
            }
        }
        reader.onerror = () => toast.error("Não foi possível carregar a imagem.")
        reader.readAsDataURL(file)
    }

    function submit(values: TeacherFormValues) {
        onSave(values)
    }

    return (
        <form onSubmit={handleSubmit(submit)} noValidate>
            <div className="space-y-10 px-6 py-8 sm:px-12 sm:py-10">
                <section className="space-y-6">
                    <SectionTitle>Seus dados</SectionTitle>
                    <div className="grid gap-6 sm:grid-cols-[1fr_240px] sm:items-center">
                        <div className="flex items-center gap-4">
                            {isProfile ? (
                                <label className="relative block cursor-pointer" title="Alterar foto de perfil">
                                    <img
                                        src={avatar || avatarImage}
                                        alt="Foto do professor"
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green text-white">
                                        <Camera size={16} />
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(event) => void handleAvatarChange(event.target.files?.[0])}
                                        aria-label="Alterar foto de perfil"
                                    />
                                </label>
                            ) : (
                                <img src={avatarImage} alt="Foto do professor" className="h-16 w-16 rounded-full object-cover" />
                            )}
                            <div>
                                <p className="font-archivo-semibold text-base text-text-title">
                                    {firstName} {lastName}
                                </p>
                                <p className="font-poppins-regular text-xs text-text-complement">
                                    {isProfile ? "Professor" : "Seu perfil Proffy"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className={labelClassName} htmlFor="whatsapp">Whatsapp</label>
                            <input
                                id="whatsapp"
                                {...register("whatsapp", {
                                    onChange: (event) => setValue("whatsapp", formatWhatsapp(event.target.value)),
                                })}
                                className={fieldClassName}
                                placeholder="(00) 00000-0000"
                                inputMode="tel"
                                aria-invalid={Boolean(errors.whatsapp)}
                            />
                            <FieldError>{errors.whatsapp?.message}</FieldError>
                        </div>
                    </div>

                    {isProfile && (
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClassName} htmlFor="firstName">Nome</label>
                                <input id="firstName" {...register("firstName")} className={fieldClassName} />
                                <FieldError>{errors.firstName?.message}</FieldError>
                            </div>
                            <div>
                                <label className={labelClassName} htmlFor="lastName">Sobrenome</label>
                                <input id="lastName" {...register("lastName")} className={fieldClassName} />
                                <FieldError>{errors.lastName?.message}</FieldError>
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClassName} htmlFor="email">E-mail</label>
                                <input id="email" type="email" {...register("email")} className={fieldClassName} />
                                <FieldError>{errors.email?.message}</FieldError>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={labelClassName} htmlFor="biography">
                            Biografia <span className="ml-2 text-[11px]">(Máximo 300 caracteres)</span>
                        </label>
                        <textarea
                            id="biography"
                            {...register("biography")}
                            maxLength={300}
                            rows={isProfile ? 5 : 4}
                            className={`${fieldClassName} h-auto min-h-28 resize-y py-3`}
                            aria-invalid={Boolean(errors.biography)}
                        />
                        <div className="flex justify-between">
                            <FieldError>{errors.biography?.message}</FieldError>
                            <span className="ml-auto text-xs text-text-complement">{biography?.length ?? 0}/300</span>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <SectionTitle>Sobre a aula</SectionTitle>
                    <div className="grid gap-5 sm:grid-cols-[1fr_205px]">
                        <div>
                            <label className={labelClassName} htmlFor="subject">Matéria</label>
                            <select
                                id="subject"
                                {...register("subject")}
                                className={fieldClassName}
                                aria-invalid={Boolean(errors.subject)}
                            >
                                <option value="">Selecione qual você quer ensinar</option>
                                {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <FieldError>{errors.subject?.message}</FieldError>
                        </div>
                        <div>
                            <label className={labelClassName} htmlFor="hourlyRate">Custo da sua hora por aula</label>
                            <div className="flex h-12 items-center rounded-md border border-gray-lines-in-white bg-white-shape pl-4 focus-within:border-purple">
                                <span className="font-poppins-regular text-sm text-text-base">R$</span>
                                <input
                                    id="hourlyRate"
                                    {...register("hourlyRate")}
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    className="h-full min-w-0 flex-1 bg-transparent px-3 font-poppins-regular text-sm text-text-base outline-none"
                                    aria-invalid={Boolean(errors.hourlyRate)}
                                />
                            </div>
                            <FieldError>{errors.hourlyRate?.message}</FieldError>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-lines-in-white pb-3">
                        <h2 className="font-archivo-semibold text-lg text-text-title">Horários disponíveis</h2>
                        <button
                            type="button"
                            onClick={() => append(createEmptySchedule())}
                            className="flex items-center gap-1 font-poppins-regular text-xs text-purple hover:text-dark-purple"
                        >
                            <Plus size={16} /> Novo horário
                        </button>
                    </div>

                    <div className="space-y-5">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid gap-4 sm:grid-cols-[1fr_140px_140px]">
                                <div>
                                    <label className={labelClassName} htmlFor={`schedules.${index}.weekDay`}>Dia da semana</label>
                                    <select
                                        id={`schedules.${index}.weekDay`}
                                        {...register(`schedules.${index}.weekDay`)}
                                        className={fieldClassName}
                                        aria-invalid={Boolean(errors.schedules?.[index]?.weekDay)}
                                    >
                                        <option value="">Selecione o dia</option>
                                        {weekDays.map((day) => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                    <FieldError>{errors.schedules?.[index]?.weekDay?.message}</FieldError>
                                </div>
                                <div>
                                    <label className={labelClassName} htmlFor={`schedules.${index}.from`}>Das</label>
                                    <input
                                        id={`schedules.${index}.from`}
                                        {...register(`schedules.${index}.from`)}
                                        type="time"
                                        className={fieldClassName}
                                        aria-invalid={Boolean(errors.schedules?.[index]?.from)}
                                    />
                                    <FieldError>{errors.schedules?.[index]?.from?.message}</FieldError>
                                </div>
                                <div>
                                    <label className={labelClassName} htmlFor={`schedules.${index}.to`}>Até</label>
                                    <input
                                        id={`schedules.${index}.to`}
                                        {...register(`schedules.${index}.to`)}
                                        type="time"
                                        className={fieldClassName}
                                        aria-invalid={Boolean(errors.schedules?.[index]?.to)}
                                    />
                                    <FieldError>{errors.schedules?.[index]?.to?.message}</FieldError>
                                </div>
                                {isProfile && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="flex items-center gap-1 justify-self-start text-xs text-red-600 hover:text-red-800 sm:col-span-3"
                                    >
                                        <Trash2 size={14} /> Excluir horário
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <FieldError>
                        {errors.schedules?.root?.message ?? errors.schedules?.message}
                    </FieldError>
                </section>
            </div>

            <footer className="flex flex-col gap-5 border-t border-gray-lines-in-white bg-white-shape px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-12">
                <div className="flex items-center gap-3 text-purple">
                    <CircleAlert size={20} />
                    <p className="font-poppins-regular text-xs">
                        <strong className="block font-poppins-semibold">Importante!</strong>
                        Preencha todos os dados corretamente.
                    </p>
                </div>
                <Button
                    type="submit"
                    title="Salvar cadastro"
                    className="m-0 w-full px-8 py-4 sm:w-auto"
                />
            </footer>
        </form>
    )
}

export function TeacherFormIntro() {
    return (
        <div className="mx-auto flex max-w-[816px] flex-col justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-0 sm:py-10">
            <div>
                <h1 className="max-w-[440px] font-archivo-bold text-3xl leading-tight text-white sm:text-4xl">
                    Que incrível que você quer dar aulas.
                </h1>
                <p className="mt-4 max-w-[340px] font-poppins-regular text-sm leading-6 text-text-purple-base">
                    O primeiro passo, é preencher esse formulário de inscrição.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <img src={rocketImage} alt="" className="h-10 w-10" />
                <p className="font-poppins-regular text-xs leading-5 text-text-purple-base">
                    Prepare-se!<br />vai ser o máximo.
                </p>
            </div>
        </div>
    )
}
