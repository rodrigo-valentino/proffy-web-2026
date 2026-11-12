export type AvailableTime = {
    id: string
    weekDay: string
    from: string
    to: string
}

export type TeacherProfile = {
    firstName: string
    lastName: string
    email: string
    whatsapp: string
    biography: string
    subject: string
    hourlyRate: string
    schedules: AvailableTime[]
    avatar?: string
}

const STORAGE_KEY = "proffy-teacher-profile"

export const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química",
]

export const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]

export function createEmptySchedule(): AvailableTime {
    return {
        id: crypto.randomUUID(),
        weekDay: "",
        from: "",
        to: "",
    }
}

export function createDefaultTeacherProfile(): TeacherProfile {
    return {
        firstName: "Rafael",
        lastName: "Rocha",
        email: "rafael.rocha@proffy.com",
        whatsapp: "",
        biography: "",
        subject: "",
        hourlyRate: "",
        schedules: [createEmptySchedule()],
    }
}

export function getTeacherProfile(): TeacherProfile {
    const storedProfile = localStorage.getItem(STORAGE_KEY)
    if (!storedProfile) return createDefaultTeacherProfile()

    return {
        ...createDefaultTeacherProfile(),
        ...JSON.parse(storedProfile) as TeacherProfile,
    }
}

export function saveTeacherProfile(profile: TeacherProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function formatWhatsapp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits ? `(${digits}` : ""

    const areaCode = digits.slice(0, 2)
    const number = digits.slice(2)
    const groupSize = digits.length > 10 ? 5 : 4
    const prefix = number.slice(0, groupSize)
    const suffix = number.slice(groupSize)

    return `(${areaCode}) ${prefix}${suffix ? `-${suffix}` : ""}`
}

export function formatHourlyRate(value: string) {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return "R$ 0,00"

    return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
}
