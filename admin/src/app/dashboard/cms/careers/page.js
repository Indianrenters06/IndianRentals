'use client';
import { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import defaults from '@/lib/careers-defaults.json';
import styles from './page.module.css';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` });
const newId = () => crypto.randomUUID();
const copyFields = {
    'Hero': ['eyebrow','title','intro','primaryLabel','secondaryLabel','heroImageAlt','heroCaption'],
    'Culture': ['cultureEyebrow','cultureTitle','cultureIntro'],
    'Opportunities': ['jobsTitle','jobsIntro','emptyTitle','emptyText','processTitle'],
    'Open application': ['generalTitle','generalText','generalButton'],
    'Application copy': ['formTitle','formIntro','submitLabel','successTitle','successText','consentText']
};
const label = key => key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
function Field({ name, value, onChange, multiline = false, children }) { return <label className={styles.field}>{name}{children || (multiline ? <textarea rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)}/> : <input value={value ?? ''} onChange={e => onChange(e.target.value)}/>)}</label>; }
function Toggle({ children, checked, onChange }) { return <label className={styles.toggle}><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>{children}</label>; }
export default function CareersEditor() {
    const [data, setData] = useState(null);
    const [tab, setTab] = useState('Page content');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [apps, setApps] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loadingApps, setLoadingApps] = useState(false);
    const [editingStatus, setEditingStatus] = useState('');
    const change = updater => { setData(updater); setDirty(true); setNotice(''); };
    const set = (key, value) => change(d => ({ ...d, [key]: value }));
    const item = (key, index, patch) => change(d => ({ ...d, [key]: d[key].map((v, i) => i === index ? { ...v, ...patch } : v) }));
    const remove = (key, index) => { if (window.confirm('Remove this item? Changes take effect when you save.')) set(key, data[key].filter((_, i) => i !== index)); };
    const move = (key, index, direction) => { const items = [...data[key]]; [items[index], items[index + direction]] = [items[index + direction], items[index]]; set(key, items); };
    async function request(path, options = {}) {
        const response = await fetch(`${API}/api/careers${path}`, { ...options, headers: headers(), cache: 'no-store' });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(json.message || `Request failed (${response.status}).`);
        return json;
    }
    useEffect(() => {
        let current = true;
        request('/admin').then(json => { if (current) setData({ ...defaults, ...json }); }).catch(e => { if (current) setError(e.message); });
        return () => { current = false; };
    }, []);
    useEffect(() => {
        if (!dirty) return;
        const warn = e => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);
    useEffect(() => {
        if (tab !== 'Applications') return;
        let current = true;
        setLoadingApps(true); setError('');
        request(`/applications?page=${page}`).then(json => { if (current) { setApps(json.items); setTotal(json.total); } }).catch(e => { if (current) setError(e.message); }).finally(() => { if (current) setLoadingApps(false); });
        return () => { current = false; };
    }, [tab, page]);
    const save = async () => {
        setSaving(true); setError(''); setNotice('');
        try { const json = await request('/admin', { method: 'PUT', body: JSON.stringify(data) }); setData(json); setDirty(false); setNotice('Careers content saved. Published roles and page changes are now live.'); }
        catch (e) { setError(e.message); }
        finally { setSaving(false); }
    };
    const status = async (id, value) => {
        setEditingStatus(id); setError('');
        try { const json = await request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status: value }) }); setApps(items => items.map(v => v._id === id ? json : v)); }
        catch (e) { setError(e.message); }
        finally { setEditingStatus(''); }
    };
    const fieldChange = (formIndex, fieldIndex, patch) => item('forms', formIndex, { fields: data.forms[formIndex].fields.map((f, i) => i === fieldIndex ? { ...f, ...patch } : f) });
    return <div className={styles.editor}>
        <header className={styles.header}><div><p>CONTENT MANAGEMENT</p><h1>Careers</h1><p>Manage your page, roles, application forms and candidate inbox.</p></div><button className={styles.primary} onClick={save} disabled={!data || saving}>{saving ? 'Saving…' : dirty ? 'Save changes' : 'Save careers page'}</button></header>
        {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.notice} role="status">{notice}</p>}
        {!data ? <p>{error ? 'Unable to load careers content. Check the API connection and your CMS permissions, then reload.' : 'Loading careers content…'}</p> : <>
            <nav className={styles.tabs} aria-label="Careers editor sections">{['Page content','Jobs','Application forms','Applications'].map(t => <button aria-current={tab === t ? 'page' : undefined} key={t} onClick={() => setTab(t)}>{t}{t === 'Jobs' ? ` (${data.jobs.length})` : ''}</button>)}</nav>
            {tab === 'Page content' && <>
                <section className={styles.panel}><h2>Visibility</h2><Toggle checked={data.enabled} onChange={v => set('enabled', v)}>Accept career applications and show published roles</Toggle><Toggle checked={data.generalEnabled} onChange={v => set('generalEnabled', v)}>Allow open applications</Toggle><p>Jobs start as drafts. Only published roles appear on the website. Changes here take effect when saved.</p></section>
                <div className={styles.columns}>{Object.entries(copyFields).map(([heading, fields]) => <section className={styles.panel} key={heading}><h2>{heading}</h2>{fields.map(key => <Field key={key} name={label(key)} value={data[key]} multiline={/intro|text|description/i.test(key)} onChange={v => set(key, v)}/>)}</section>)}
                    <section className={styles.panel}><h2>Hero image</h2><ImageUploader existingUrl={data.heroImage} onUpload={url => set('heroImage', url)} label="Upload careers image"/><Field name="Image URL" value={data.heroImage} onChange={v => set('heroImage', v)}/><button onClick={() => set('heroImage', '')}>Remove image</button></section>
                </div>
                {['benefits','steps'].map(key => <section className={styles.panel} key={key}><h2>{key === 'benefits' ? 'Culture cards' : 'Hiring process steps'}</h2>{data[key].map((row, i) => <div className={styles.item} key={i}><Field name="Title" value={row.title} onChange={v => item(key, i, { title: v })}/><Field name="Description" multiline value={row.description} onChange={v => item(key, i, { description: v })}/><div className={styles.actions}><button disabled={i === 0} onClick={() => move(key, i, -1)}>Move up</button><button disabled={i === data[key].length - 1} onClick={() => move(key, i, 1)}>Move down</button><button onClick={() => remove(key, i)}>Remove</button></div></div>)}<button disabled={data[key].length >= 12} onClick={() => set(key, [...data[key], { title: '', description: '' }])}>+ Add {key === 'benefits' ? 'culture card' : 'step'}</button></section>)}
            </>}
            {tab === 'Jobs' && <section className={styles.panel}><div className={styles.header}><h2>Roles</h2><button className={styles.primary} onClick={() => set('jobs', [...data.jobs, { id: newId(), title: 'New role', department: '', location: '', type: 'Full-time', experience: '', description: '', requirements: '', status: 'draft', formId: data.defaultFormId }])}>+ Add job</button></div>{!data.jobs.length && <p>No roles yet. Add a job, fill in the details and set its status to Published when it is ready.</p>}{data.jobs.map((job, i) => <details className={styles.item} key={job.id} open><summary>{job.title} · {job.status}</summary><div className={styles.columns}>{['title','department','location','type','experience'].map(key => <Field key={key} name={label(key)} value={job[key]} onChange={v => item('jobs', i, { [key]: v })}/>)}<Field name="Status"><select value={job.status} onChange={e => item('jobs', i, { status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option></select></Field><Field name="Application form"><select value={job.formId || data.defaultFormId} onChange={e => item('jobs', i, { formId: e.target.value })}>{data.forms.map(f => <option value={f.id} key={f.id}>{f.name}</option>)}</select></Field></div><Field name="Job description" multiline value={job.description} onChange={v => item('jobs', i, { description: v })}/><Field name="Requirements (one per line)" multiline value={job.requirements} onChange={v => item('jobs', i, { requirements: v })}/><div className={styles.actions}><button disabled={i === 0} onClick={() => move('jobs', i, -1)}>Move up</button><button disabled={i === data.jobs.length - 1} onClick={() => move('jobs', i, 1)}>Move down</button><button onClick={() => remove('jobs', i)}>Remove job</button></div></details>)}</section>}
            {tab === 'Application forms' && <section className={styles.panel}><h2>Application forms</h2><p>Full name, email and consent are always required. Add additional questions below. CVs use a link, so applicants can share their existing resume. Assign a form to each role in Jobs.</p><Field name="Default form for open applications"><select value={data.defaultFormId} onChange={e => set('defaultFormId', e.target.value)}>{data.forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></Field>{data.forms.map((form, fi) => <section className={styles.item} key={form.id}><Field name="Form name" value={form.name} onChange={v => item('forms', fi, { name: v })}/>{form.fields.map((field, i) => <div className={styles.formField} key={field.id}><div className={styles.columns}><Field name="Question label" value={field.label} onChange={v => fieldChange(fi, i, { label: v })}/><Field name="Field type"><select value={field.type} onChange={e => fieldChange(fi, i, { type: e.target.value })}>{['text','email','tel','url','textarea','select'].map(t => <option key={t} value={t}>{t}</option>)}</select></Field></div>{field.type === 'select' && <Field name="Options (one per line)" multiline value={field.options.join('\n')} onChange={v => fieldChange(fi, i, { options: v.split('\n') })}/>}<Toggle checked={field.required} onChange={v => fieldChange(fi, i, { required: v })}>Required</Toggle><div className={styles.actions}><button disabled={i === 0} onClick={() => { const fields = [...form.fields]; [fields[i], fields[i - 1]] = [fields[i - 1], fields[i]]; item('forms', fi, { fields }); }}>Move up</button><button onClick={() => item('forms', fi, { fields: form.fields.filter((_, n) => n !== i) })}>Remove question</button></div></div>)}<div className={styles.actions}><button disabled={form.fields.length >= 20} onClick={() => item('forms', fi, { fields: [...form.fields, { id: newId(), label: 'New question', type: 'text', required: false, options: [] }] })}>+ Add question</button><button disabled={form.id === data.defaultFormId || data.jobs.some(j => j.formId === form.id)} onClick={() => remove('forms', fi)}>Remove form</button></div><p>To remove a form, first unassign it from all roles and the default form.</p></section>)}<button disabled={data.forms.length >= 20} onClick={() => set('forms', [...data.forms, { id: newId(), name: 'New application form', fields: [] }])}>+ Add form</button></section>}
            {tab === 'Applications' && <section className={styles.panel}><h2>Applications ({total})</h2><p>Submissions are stored here. Status changes save immediately. Page content changes use the Save button above.</p>{loadingApps ? <p role="status">Loading applications…</p> : !apps.length ? <p>No applications yet.</p> : apps.map(app => <details className={styles.item} key={app._id}><summary>{app.fullName} · {app.jobTitle} · {app.status}</summary><p>{app.email} · {new Date(app.createdAt).toLocaleDateString()}</p><Field name="Review status"><select disabled={editingStatus === app._id} value={app.status} onChange={e => status(app._id, e.target.value)}>{['new','reviewing','shortlisted','closed'].map(s => <option key={s}>{s}</option>)}</select></Field><dl className={styles.answers}>{app.answers.map((a, i) => <div key={i}><dt>{a.label}</dt><dd>{/^https?:\/\//i.test(a.value) ? <a href={a.value} target="_blank" rel="noopener noreferrer">{a.value}</a> : a.value || '—'}</dd></div>)}</dl><p>Consent recorded: {new Date(app.consentAt).toLocaleString()}</p><p>{app.consentText}</p></details>)}<div className={styles.actions}><button disabled={page <= 1 || loadingApps} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page}</span><button disabled={page * 25 >= total || loadingApps} onClick={() => setPage(p => p + 1)}>Next</button></div></section>}
        </>}
    </div>;
}
