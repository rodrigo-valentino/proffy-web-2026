import { useState } from "react"
import { Link, useNavigate } from "react-router"
import goBack from "../../assets/goback.svg"
import proffyLogo from "../../assets/proffy-logo.svg"
import { TeacherFormIntro, TeacherRegistrationForm } from "../../components/teacher-registration-form"
import { getTeacherProfile, saveTeacherProfile, type TeacherProfile } from "../../lib/teacher-profile"
import { toast } from "sonner"

export function GiveClasses() {
    const navigate = useNavigate()
    const [profile] = useState(getTeacherProfile)

    function handleSave(values: TeacherProfile) {
        try {
            saveTeacherProfile(values)
            navigate("/give-classes/success")
        } catch {
            toast.error("Não foi possível salvar o cadastro. Tente novamente.")
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
                        <h1 className="text-center font-archivo-semibold text-sm text-text-purple-base">Dar aulas</h1>
                        <img src={proffyLogo} alt="Proffy" className="ml-auto h-4 w-12" />
                    </div>
                </header>
                <TeacherFormIntro />
            </div>
            <main className="mx-auto -mt-2 max-w-[816px] px-4 pb-12 sm:-mt-3 sm:px-0">
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <TeacherRegistrationForm profile={profile} onSave={handleSave} />
                </div>
            </main>
        </div>
    )
}
