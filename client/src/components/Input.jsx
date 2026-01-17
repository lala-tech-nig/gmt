import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, error, placeholder, required = false, options = [] }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
            </label>

            {type === 'select' ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: 'var(--border-radius)',
                        border: `1px solid ${error ? 'var(--error)' : '#ccc'}`,
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: 'var(--border-radius)',
                        border: `1px solid ${error ? 'var(--error)' : '#ccc'}`,
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                    }}
                />
            )}

            {error && <span style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
        </div>
    );
};

export default Input;
