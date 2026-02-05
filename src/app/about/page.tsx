export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-white">
            <div className="max-w-[1920px] mx-auto">

                {/* Bio Section */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/20 pb-20">
                    <div className="md:col-span-4">
                        <h2 className="font-mono text-xs uppercase text-gray-500 tracking-widest sticky top-32">Biografía</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5 text-xl md:text-3xl font-light leading-relaxed">
                        <p className="mb-10">
                            Berejena Studio es el espacio creativo de un director con base en la República Dominicana, enfocado en capturar la esencia vibrante y auténtica del Caribe.
                        </p>
                        <p>
                            Especializado en narrativas visuales que trascienden fronteras, desde videos musicales hasta comerciales de alto impacto, siempre con una mirada cinematográfica y un estilo inconfundible.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/20 pb-20">
                    <div className="md:col-span-4">
                        <h2 className="font-mono text-xs uppercase text-gray-500 tracking-widest sticky top-32">Contacto</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase">Representación (US)</h3>
                            <p className="font-sans text-xl">Anonymous Content</p>
                            <a href="mailto:rep@anonymouscontent.com" className="font-sans text-sm text-gray-400 hover:text-accent transition-colors">rep@anonymouscontent.com</a>
                        </div>
                        <div>
                            <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase">Directo</h3>
                            <a href="mailto:hola@berejenastudio.com" className="font-sans text-xl hover:text-accent transition-colors block">hola@berejenastudio.com</a>
                        </div>
                        <div className="md:col-span-2 flex gap-8 pt-10">
                            <a href="#" className="uppercase font-mono text-xs tracking-widest hover:text-accent transition-colors">Instagram</a>
                            <a href="#" className="uppercase font-mono text-xs tracking-widest hover:text-accent transition-colors">Vimeo</a>
                            <a href="#" className="uppercase font-mono text-xs tracking-widest hover:text-accent transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </section>


                {/* Selected Clients */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32">
                    <div className="md:col-span-4">
                        <h2 className="font-mono text-xs uppercase text-gray-500 tracking-widest sticky top-32">Clientes Seleccionados</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5">
                        <div className="flex flex-wrap gap-x-12 gap-y-4 text-3xl md:text-5xl font-sans font-bold uppercase text-gray-800">
                            <span className="hover:text-white transition-colors cursor-default">Nike</span>
                            <span className="hover:text-white transition-colors cursor-default">Adidas</span>
                            <span className="hover:text-white transition-colors cursor-default">Vogue</span>
                            <span className="hover:text-white transition-colors cursor-default">Mercedes-Benz</span>
                            <span className="hover:text-white transition-colors cursor-default">Sony</span>
                            <span className="hover:text-white transition-colors cursor-default">Rimowa</span>
                            <span className="hover:text-white transition-colors cursor-default">Prada</span>
                            <span className="hover:text-white transition-colors cursor-default">Beats by Dre</span>
                            <span className="hover:text-white transition-colors cursor-default">Porsche</span>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
