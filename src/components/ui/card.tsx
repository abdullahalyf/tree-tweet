import React from 'react';

interface CardProps { children: React.ReactNode; className?: string; }
export function Card({ children, className = '' }: CardProps) {
  return <div className={`workspace-card ${className}`}>{children}</div>;
}
export function CardHeader({ title, subtitle, action, className = '' }: {
  title: string; subtitle?: string; action?: React.ReactNode; className?: string;
}) {
  return <div className={`workspace-card-header ${className}`}><div className="min-w-0"><h3 className="text-lg font-bold text-slate-800">{title}</h3>{subtitle && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{subtitle}</p>}</div>{action && <div className="shrink-0">{action}</div>}</div>;
}
export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`workspace-card-body ${className}`}>{children}</div>;
}
