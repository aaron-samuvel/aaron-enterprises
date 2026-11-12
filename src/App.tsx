import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Cog, Download, Factory, Mail, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Wrench, X } from 'lucide-react'
import siteData from './rudra-data.json'

type Specification = Record<string, string>
type Accessory = { 'No.': string; 'Part Number': string; 'Part Name': string }
type Product = {
  name: string
  models: string[]
  specifications?: Specification[]
  optional_accessories?: Accessory[]
  optional_accessories_list_on_page?: string[]
  standard_equipment_on_page?: string[]
}

const { company, products, contacts, associates } = siteData as unknown as {
  company: { name: string; vision: string; mission: string; quality_policy: string; range_statement: string; homepage_body: string[]; stats_claims: { claim: string }[] }
  products: Product[]
  contacts: {
    website_address: { as_printed_on_contact_page: string }
    email: string
    phones_on_contact_page: string[]
    whatsapp: { number: string }
    map: { embed_url: string; latitude: number; longitude: number }
  }
  associates: { region: string; name: string; phone: string }[]
}

const asset = (file: string) => `${import.meta.env.BASE_URL}rudra/${file}`
const machineImages = [
  asset('turret-capstan.png'),
  asset('auto-turret-capstan.jpg'),
  asset('single-spindle.png'),
  asset('spares-accessories.png'),
]
const productAnchors = ['turret', 'auto-turret', 'single-spindle', 'spares']
const productDescriptions = [
  'Dependable conventional turning, built around TC25 and TC32 capacity.',
  'Servo driven automatic operation with AC25 and AC32 configurations.',
  'Single spindle automats for repeatable production across three model sizes.',
  'Machine spares and accessories to support your equipment and processes.',
]
const addressLabel = contacts.website_address.as_printed_on_contact_page
const aaronAddress = 'G-5, Panchal Estate, Goddev Road, Bhayander East, Thane, Maharashtra – 401105'
const r = (number: string) => number.replace(/\D/g, '')
const tel = (number: string) => `tel:+91${r(number).replace(/^0+/, '').replace(/^91/, '')}`

function Brand() {
  return <a className="brand" href="#top" aria-label="Rudra Automation home"><img src={asset('rudra-logo.png')} alt="Rudra Automation" /></a>
}

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['Machines', '#machines'], ['About', '#about'], ['Associates', '#associates'], ['Contact', '#contact']]
  return <header className="site-header">
    <div className="header-inner"><Brand />
      <button className="mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-brochure" href={asset('brochure.pdf')} target="_blank" rel="noreferrer">Brochure <ArrowUpRight size={15} /></a></nav>
    </div>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-image" style={{ backgroundImage: `url("${asset('workshop.jpg')}")` }} role="img" aria-label="Rudra Automation machine tool" />
    <div className="hero-shade" />
    <div className="hero-content wrap">
      <span className="kicker"><i /> MACHINE TOOLS · COIMBATORE, INDIA</span>
      <h1>Built for the<br /><em>work that matters.</em></h1>
      <p>Turret capstan machines, single spindle automats and purpose-built support for precision manufacturing.</p>
      <div className="hero-actions"><a className="button button-orange" href="#machines">Explore our machines <ArrowRight size={17} /></a><a className="button button-ghost" href="#contact">Talk to our team <ArrowUpRight size={16} /></a></div>
      <div className="hero-note"><span>01 — 04</span><i /> ENGINEERING FOR INDUSTRY</div>
    </div>
    <a className="hero-scroll" href="#intro"><ArrowDown size={17} /><span>SCROLL TO EXPLORE</span></a>
  </section>
}

function Intro() {
  return <section className="intro section-pad" id="intro"><div className="wrap intro-grid">
    <div><span className="eyebrow">RUDRA AUTOMATION <b> / </b> MACHINE TOOLS</span><h2>Machines shaped<br />around <span>precision.</span></h2></div>
    <div className="intro-copy"><p>{company.homepage_body[0]}</p><p>We also work with Siemens V90 servo motors and drives, Lubi Electronics products, and retrofit CNC and conventional machines.</p><a className="text-link" href="#about">Get to know Rudra <ArrowUpRight size={17} /></a></div>
    <div className="intro-stat"><strong>10,000<span>+</span></strong><span>machines supplied</span><small>As stated by Rudra Automation</small></div>
  </div></section>
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const anchor = productAnchors[index]
  const models = product.models.length ? product.models.join('  /  ') : 'Machine support and accessories'
  return <article className={`machine-card machine-card-${index + 1}`} id={anchor}>
    <a className="machine-photo" href={`#details-${anchor}`} aria-label={`View ${product.name} details`}><img src={machineImages[index]} alt={product.name} loading="lazy"/><span className="machine-index">0{index + 1}</span><span className="photo-arrow"><ArrowUpRight size={20} /></span></a>
    <div className="machine-copy"><span className="eyebrow">{index === 3 ? 'SUPPORT & COMPONENTS' : 'RUDRA MACHINE SERIES'}</span><h3>{product.name}</h3><p>{productDescriptions[index]}</p><div className="model-line"><span>MODELS</span><b>{models}</b></div><a href={`#details-${anchor}`} className="text-link">Specifications & details <ArrowRight size={16} /></a></div>
  </article>
}

function ProductDetails({ product, index }: { product: Product; index: number }) {
  const anchor = productAnchors[index]
  const specs = product.specifications ?? []
  const models = product.models.map(model => model.startsWith('AC') ? model.replace(/^(AC)(\d+)$/, '$1 $2') : model)
  return <details className="product-details" id={`details-${anchor}`}>
    <summary><span><small>PRODUCT {String(index + 1).padStart(2, '0')}</small><b>{product.name}</b></span><ChevronDown size={19} /></summary>
    {specs.length > 0 && <div className="table-scroll"><table><thead><tr><th>Specification</th>{models.map(model => <th key={model}>{model}</th>)}</tr></thead><tbody>{specs.filter(row => {
      const label = row.MODEL ?? row.Model ?? ''
      return label && models.some(model => Boolean(row[model]))
    }).map((row, rowIndex) => {
      const label = row.MODEL ?? row.Model ?? ''
      return <tr key={`${label}-${rowIndex}`}><th scope="row">{label}</th>{models.map(model => <td key={model}>{row[model] || '—'}</td>)}</tr>
    })}</tbody></table></div>}
    {product.standard_equipment_on_page && <div className="detail-list"><h4>Standard equipment</h4><ul>{product.standard_equipment_on_page.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></div>}
    {(product.optional_accessories?.length || product.optional_accessories_list_on_page?.length) ? <div className="detail-list"><h4>Optional accessories</h4><ul>{(product.optional_accessories ?? []).map(item => <li key={item['Part Number'] + item['Part Name']}><Wrench size={15} /><span>{item['Part Name']} {item['Part Number'] && <small>({item['Part Number']})</small>}</span></li>)}{(product.optional_accessories_list_on_page ?? []).map(item => <li key={item}><Wrench size={15} />{item}</li>)}</ul></div> : null}
    {!specs.length && index === 3 && <p className="detail-note">Contact us with your machine model and requirement. The supplied material does not publish a full spares catalogue.</p>}
    <a className="button button-navy details-cta" href={`mailto:${contacts.email}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`}>Enquire about this range <ArrowUpRight size={16} /></a>
  </details>
}

function Machines() {
  return <section className="machines section-pad" id="machines"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">DESIGNED TO MAKE</span><h2>Our machine range</h2></div><p>Explore the core machine families and their published specifications. Share your application with us for model guidance.</p></div>
    <div className="machine-grid">{products.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}</div>
    <div className="all-details"><span className="eyebrow">TECHNICAL INFORMATION</span>{products.map((product, index) => <ProductDetails key={product.name} product={product} index={index} />)}<p className="spec-note">Specifications are transcribed from Rudra Automation’s published tables. Contact the team to confirm the current configuration for your application.</p></div>
  </div></section>
}

function Capabilities() {
  const items = [
    { icon: Factory, no: '01', title: 'Machine manufacturing', text: 'Turret capstan, auto turret capstan, single spindle automat and special purpose machines.' },
    { icon: Cog, no: '02', title: 'Retrofitting', text: 'Retrofitting support for CNC and conventional machines.' },
    { icon: ShieldCheck, no: '03', title: 'Quality and service', text: 'A continual improvement approach, with attention to cost, delivery and after-sales service.' },
  ]
  return <section className="capabilities section-pad" id="about"><div className="wrap"><div className="section-heading light"><div><span className="eyebrow">OUR APPROACH</span><h2>Experience, applied<br />with care.</h2></div><p>Rudra Automation serves precision engineering, automobile component and industrial manufacturing requirements.</p></div><div className="capability-grid">{items.map(({ icon: Icon, no, title, text }) => <article key={no}><span className="cap-icon"><Icon size={22} /></span><small>{no}</small><h3>{title}</h3><p>{text}</p></article>)}</div><div className="values-grid"><div><span>OUR VISION</span><p>{company.vision}</p></div><div><span>OUR MISSION</span><p>To exceed customer expectations and use their needs to guide improvement in our products and processes.</p></div><div><span>OUR QUALITY</span><p>Quality, cost-effective products, continual improvement, on-time delivery and prompt service.</p></div></div></div></section>
}

function Associates() {
  return <section className="associates section-pad" id="associates"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">A WIDER REACH</span><h2>Connect with a local associate.</h2></div><p>Regional sales contacts listed by Rudra Automation.</p></div><div className="associate-grid">{associates.map((person, index) => <a className="associate" href={tel(person.phone)} key={`${person.region}-${index}`}><span><MapPin size={16} />{person.region}</span><b>{person.name}</b><small><Phone size={14} />{person.phone}</small></a>)}</div></div></section>
}

function MapCard({ title, address, src, href, note }: { title: string; address: string; src: string; href: string; note: string }) {
  return <article className="map-card"><div className="map-frame"><iframe title={`${title} map`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><div className="map-copy"><span className="eyebrow"><MapPin size={14} /> {title}</span><p>{address}</p><small>{note}</small><a className="text-link" href={href} target="_blank" rel="noreferrer">Open map <ArrowUpRight size={15} /></a></div></article>
}

function Contact() {
  const maps = [
    { title: 'Rudra Automation · Coimbatore', address: addressLabel, src: contacts.map.embed_url, href: `https://www.google.com/maps?q=${contacts.map.latitude},${contacts.map.longitude}`, note: 'Machine company contact address' },
    { title: 'Aaron Enterprises · Registered address', address: aaronAddress, src: `https://www.google.com/maps?q=${encodeURIComponent(aaronAddress)}&output=embed`, href: `https://www.google.com/maps?q=${encodeURIComponent(aaronAddress)}`, note: 'Address only, from the separate GST record' },
  ]
  return <section className="contact section-pad" id="contact"><div className="wrap"><div className="contact-top"><div><span className="eyebrow">START A CONVERSATION</span><h2>Let’s talk about<br /><em>your next machine.</em></h2></div><a className="button button-orange" href={`https://wa.me/${contacts.whatsapp.number}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp Rudra Automation <ArrowUpRight size={16} /></a></div><div className="contact-grid"><div className="contact-info"><h3>Get in touch</h3><p>Talk to us about machine specifications, retrofits, spares or an application you have in mind.</p><a href={`mailto:${contacts.email}`}><Mail size={18} /><span><small>EMAIL</small><b>{contacts.email}</b></span></a>{contacts.phones_on_contact_page.map(phone => <a href={tel(phone)} key={phone}><Phone size={18} /><span><small>PHONE</small><b>{phone}</b></span></a>)}<div className="contact-address"><MapPin size={19} /><div><small>RUDRA AUTOMATION ADDRESS</small><p>{addressLabel}</p></div></div><a className="brochure-link" href={asset('brochure.pdf')} target="_blank" rel="noreferrer"><Download size={17} /> View company brochure <ArrowUpRight size={15} /></a></div><div className="maps-grid">{maps.map(map => <MapCard key={map.title} {...map} />)}</div></div></div></section>
}

function Footer() {
  return <footer className="footer"><div className="wrap footer-main"><Brand /><p>Machine tools for precision work.<br />Rudra Automation · Coimbatore, India</p><div className="footer-links"><a href="#machines">Machine range</a><a href="#about">About Rudra</a><a href="#associates">Associates</a><a href="#contact">Contact</a></div><div className="footer-legal"><small>Aaron Enterprises registered address (as provided):</small><span>{aaronAddress}</span></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Rudra Automation. All rights reserved.</span><a href="#top">Back to top ↑</a></div></footer>
}

function App() {
  return <><Header /><main><Hero /><Intro /><Machines /><Capabilities /><Associates /><Contact /></main><Footer /></>
}

export default App
