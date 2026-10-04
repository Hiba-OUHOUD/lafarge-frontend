import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ==================== TOP BAR (Orange) ==================== */}
            <div className="bg-orange-500 text-white text-xs py-2 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex gap-6">
                        <span>📞 +212 5 22 00 00 00</span>
                        <span className="hidden md:inline">✉️ contact@lafarge-elearning.ma</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:opacity-75">FB</a>
                        <a href="#" className="hover:opacity-75">IN</a>
                        <a href="#" className="hover:opacity-75">TW</a>
                    </div>
                </div>
            </div>

            {/* ==================== HEADER (Noir) ==================== */}
            <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            L
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-none">LAFARGE</span>
                            <span className="text-[10px] text-orange-500 uppercase tracking-widest">E-Learning</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
                        <button onClick={() => scrollToSection('home')} className="hover:text-orange-500 transition">Accueil</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition">À propos</button>
                        <button onClick={() => scrollToSection('courses')} className="hover:text-orange-500 transition">Formations</button>
                        <button onClick={() => scrollToSection('activities')} className="hover:text-orange-500 transition">Actualités</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-orange-500 transition">Contact</button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/register')}
                                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-5 py-2 rounded text-sm font-bold uppercase tracking-wide transition"
                            >
                                S'inscrire
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded text-sm font-bold uppercase tracking-wide transition"
                            >
                                Se connecter
                            </button>
                        </div>
                    </nav>

                    <button
                        onClick={() => navigate('/login')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-bold uppercase tracking-wide transition"
                    >
                        Se connecter
                    </button>
                </div>
            </header>

            {/* ==================== HERO (Image de fond sombre) ==================== */}
            <section id="home" className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
                {/* Décorations */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
                    <div className="inline-block border-2 border-orange-500 text-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6">
                        🎓 Plateforme de formation
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        FORMEZ<span className="text-orange-500"> ET </span>
                        <br />
                        PROGRESSEZ
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
                        Développez vos compétences professionnelles grâce à notre catalogue
                        de formations en ligne. Suivez votre progression, passez les quiz
                        et obtenez vos certificats reconnus.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-bold uppercase tracking-wide transition"
                        >
                            Commencer maintenant
                        </button>
                        <button
                            onClick={() => scrollToSection('courses')}
                            className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 font-bold uppercase tracking-wide transition"
                        >
                            Voir les formations
                        </button>
                    </div>
                </div>

                {/* ==================== 3 CARTES SUPERPOSÉES ==================== */}
                <div className="relative max-w-7xl mx-auto px-6 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
                        {/* Carte 1 : Admin */}
                        <div className="bg-gray-900 border-b-4 border-gray-700 p-8 text-center md:-mb-8">
                            <div className="text-4xl mb-4">👤</div>
                            <h3 className="text-xl font-bold mb-3">Espace Admin</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Gérez les utilisateurs, créez les formations,
                                assignez les formateurs et suivez les statistiques.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-wide transition"
                            >
                                Accéder
                            </button>
                        </div>

                        {/* Carte 2 : Formateur (surélevée et orange) */}
                        <div className="bg-orange-500 p-8 text-center md:-translate-y-4 shadow-2xl">
                            <div className="text-4xl mb-4">👨‍🏫</div>
                            <h3 className="text-xl font-bold mb-3">Espace Formateur</h3>
                            <p className="text-orange-50 text-sm leading-relaxed mb-6">
                                Enrichissez le contenu de vos formations,
                                suivez la progression de vos apprenants.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-black hover:bg-gray-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wide transition"
                            >
                                Accéder
                            </button>
                        </div>

                        {/* Carte 3 : Employé */}
                        <div className="bg-gray-900 border-b-4 border-gray-700 p-8 text-center md:-mb-8">
                            <div className="text-4xl mb-4">🎓</div>
                            <h3 className="text-xl font-bold mb-3">Espace Employé</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Suivez vos formations personnalisées, passez les quiz
                                et téléchargez vos certificats.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-wide transition"
                            >
                                Accéder
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== NOS FORMATIONS ==================== */}
            <section id="courses" className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">
                            Nos Formations
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Découvrez nos formations populaires
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Des formations conçues par des experts pour développer
                            les compétences de chaque métier
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '⚡',
                                gradient: 'from-yellow-500 to-orange-600',
                                title: 'Notions de base en Électricité',
                                desc: 'Introduction aux principes fondamentaux : courant, tension, circuits.',
                                domain: 'ÉLECTRICITÉ',
                                budget: '3 chapitres',
                                raised: 'Débutant'
                            },
                            {
                                icon: '⚙️',
                                gradient: 'from-blue-600 to-blue-800',
                                title: 'Maintenance Mécanique',
                                desc: 'Formation sur la maintenance préventive et curative.',
                                domain: 'MÉCANIQUE',
                                budget: '3 chapitres',
                                raised: 'Débutant'
                            },
                            {
                                icon: '🦺',
                                gradient: 'from-red-500 to-red-700',
                                title: 'Sécurité sur Chantier',
                                desc: 'Formation obligatoire sur les règles de sécurité.',
                                domain: 'SÉCURITÉ',
                                budget: '3 chapitres',
                                raised: 'Obligatoire'
                            }
                        ].map((course, i) => (
                            <div key={i} className="bg-white shadow-lg hover:shadow-2xl transition">
                                {/* En-tête image */}
                                <div className={`relative h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                                    <div className="text-7xl">{course.icon}</div>
                                    {/* Cercle orange flottant */}
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                        🎓
                                    </div>
                                </div>

                                <div className="p-6 pt-10 text-center">
                                    <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded mb-3 uppercase">
                                        {course.domain}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-5">
                                        {course.desc}
                                    </p>
                                    {/* Barres d'info */}
                                    <div className="flex justify-between text-xs text-gray-500 mb-5 pb-5 border-b">
                                        <div>
                                            <div className="font-bold text-gray-700">Chapitres</div>
                                            <div>{course.budget}</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-700">Niveau</div>
                                            <div>{course.raised}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 text-sm font-bold uppercase tracking-wide transition"
                                    >
                                        Commencer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/login')}
                            className="border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 px-8 py-3 font-bold uppercase tracking-wide transition"
                        >
                            Voir toutes les formations
                        </button>
                    </div>
                </div>
            </section>

            {/* ==================== FEATURE + ACTIVITÉS ==================== */}
            <section id="activities" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Feature (2 colonnes) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-orange-500 inline-block">
                            Formation en vedette
                        </h2>

                        <div className="bg-gray-50 rounded-lg p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg h-64 flex items-center justify-center">
                                    <div className="text-8xl">⚙️</div>
                                </div>
                                <div>
                                    <span className="text-xs text-orange-500 font-bold uppercase tracking-widest">
                                        Nouvelle formation
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
                                        Maintenance Mécanique Industrielle
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        Apprenez les techniques de maintenance préventive
                                        et curative, le diagnostic des pannes et la
                                        lubrification industrielle.
                                    </p>

                                    {/* Détails */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white p-3 rounded">
                                            <div className="text-xs text-gray-500">Formateur</div>
                                            <div className="font-bold text-gray-800 text-sm">Karim Alami</div>
                                        </div>
                                        <div className="bg-white p-3 rounded">
                                            <div className="text-xs text-gray-500">Niveau</div>
                                            <div className="font-bold text-gray-800 text-sm">Débutant</div>
                                        </div>
                                        <div className="bg-white p-3 rounded">
                                            <div className="text-xs text-gray-500">Chapitres</div>
                                            <div className="font-bold text-gray-800 text-sm">3</div>
                                        </div>
                                        <div className="bg-white p-3 rounded">
                                            <div className="text-xs text-gray-500">Durée</div>
                                            <div className="font-bold text-gray-800 text-sm">45 min</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-bold uppercase tracking-wide transition"
                                    >
                                        Découvrir →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dernières activités (1 colonne) */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-orange-500 inline-block">
                            Dernières activités
                        </h2>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: '🎓',
                                    color: 'bg-orange-500',
                                    title: 'Nouveau certificat délivré',
                                    desc: 'Ahmed Benali a terminé "Maintenance Mécanique"',
                                    time: 'Il y a 2 heures'
                                },
                                {
                                    icon: '📚',
                                    color: 'bg-blue-500',
                                    title: 'Nouvelle formation disponible',
                                    desc: 'Découvrez "Automatismes Industriels"',
                                    time: 'Il y a 1 jour'
                                },
                                {
                                    icon: '👥',
                                    color: 'bg-green-500',
                                    title: 'Nouvel employé inscrit',
                                    desc: 'Lucas Moreau a rejoint la plateforme',
                                    time: 'Il y a 3 jours'
                                },
                                {
                                    icon: '🏆',
                                    color: 'bg-purple-500',
                                    title: 'Quiz réussi',
                                    desc: 'Marie Curie a réussi son quiz avec 100%',
                                    time: 'Il y a 5 jours'
                                }
                            ].map((activity, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">
                                            {activity.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                            {activity.desc}
                                        </p>
                                        <span className="text-[10px] text-orange-500 font-medium uppercase tracking-wide">
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== À PROPOS + STATS ==================== */}
            <section id="about" className="py-16 px-6 bg-orange-500 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: '👥', value: '10+', label: 'Employés' },
                        { icon: '📚', value: '17+', label: 'Formations' },
                        { icon: '🎓', value: '3+', label: 'Certificats' },
                        { icon: '⭐', value: '98%', label: 'Satisfaction' }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-5xl mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm opacity-90 uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ==================== CTA FINAL ==================== */}
            <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">🎓</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Prêt à développer vos compétences ?
                    </h2>
                    <p className="text-gray-400 text-lg mb-10">
                        Rejoignez la communauté Lafarge E-Learning et
                        commencez votre parcours dès aujourd'hui.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 font-bold text-lg uppercase tracking-wide transition"
                    >
                        🚀 Se connecter maintenant
                    </button>
                </div>
            </section>

            {/* ==================== FOOTER (Noir) ==================== */}
            <footer id="contact" className="bg-black text-gray-400 pt-16 pb-6 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                                L
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white leading-none">LAFARGE</span>
                                <span className="text-[10px] text-orange-500 uppercase tracking-widest">E-Learning</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed mb-4">
                            La plateforme de formation en ligne de LafargeHolcim Maroc.
                            Développez vos compétences à votre rythme.
                        </p>
                        <div className="flex gap-2">
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center text-xs transition">FB</a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center text-xs transition">IN</a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center text-xs transition">TW</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Liens utiles</h3>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => scrollToSection('home')} className="hover:text-orange-500 transition">Accueil</button></li>
                            <li><button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition">À propos</button></li>
                            <li><button onClick={() => scrollToSection('courses')} className="hover:text-orange-500 transition">Formations</button></li>
                            <li><button onClick={() => scrollToSection('activities')} className="hover:text-orange-500 transition">Actualités</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Nos domaines</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-orange-500 transition cursor-pointer">⚡ Électricité</li>
                            <li className="hover:text-orange-500 transition cursor-pointer">🏗️ Béton</li>
                            <li className="hover:text-orange-500 transition cursor-pointer">⚙️ Mécanique</li>
                            <li className="hover:text-orange-500 transition cursor-pointer">🦺 Sécurité</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500">📍</span>
                                <span>Casablanca, Maroc</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500">📞</span>
                                <span>+212 5 22 00 00 00</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500">✉️</span>
                                <span>contact@lafarge-elearning.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-3">
                        <span>© {new Date().getFullYear()} <span className="text-orange-500 font-bold">LafargeHolcim Maroc</span> — Tous droits réservés</span>
                        <span>Développé avec ❤️ pour l'excellence</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;