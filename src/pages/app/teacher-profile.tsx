import { useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import goBack from "../../assets/goback.svg"
import proffyLogo from "../../assets/proffy-logo.svg"
import avatarImage from "../../assets/avatar.svg"
import { TeacherRegistrationForm } from "../../components/teacher-registration-form"
import { getTeacherProfile, saveTeacherProfile, type TeacherProfile } from "../../lib/teacher-profile"

export function TeacherProfilePage() {
    const [profile, setProfile] = useState(getTeacherProfile)
    const fullName = `${profile.firstName} ${profile.lastName}`.trim()

    function handleSave(values: TeacherProfile) {
        try {
            saveTeacherProfile(values)
            setProfile(values)
            toast.success("Cadastro atualizado com sucesso.")
        } catch {
            toast.error("Não foi possível salvar as alterações. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-purple">
                <header className="h-16 border-b border-white/10">
                    <div className="mx-auto grid h-full max-w-[1080px] grid-cols-3 items-center px-6">
                        <Link to="/" aria-label="Voltar para a página inicial">
                            <img src={goBack} alt="" className="h-8 w-8" />
                        </Link>
                        <h1 className="text-center font-archivo-semibold text-sm text-text-purple-base">Meu perfil</h1>
                        <img src={proffyLogo} alt="Proffy" className="ml-auto h-4 w-12" />
                    </div>
                </header>
                <div className="flex min-h-[280px] flex-col items-center justify-center px-4 pb-12 pt-8 text-center">
                    <img
                        src={profile.avatar || avatarImage}
                        alt={`Foto de ${fullName}`}
                        className="h-24 w-24 rounded-full object-cover"
                    />
                    <h2 className="mt-4 font-archivo-bold text-2xl text-white">{fullName}</h2>
                    <p className="mt-1 font-poppins-regular text-base text-text-purple-base">
                        {profile.subject || "Sua matéria"}
                    </p>
                </div>
            </div>
            <main className="mx-auto -mt-8 max-w-[816px] px-4 pb-12 sm:px-0">
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <TeacherRegistrationForm
                        profile={profile}
                        isProfile
                        onSave={handleSave}
                    />
                </div>
            </main>
        </div>
    )
}
