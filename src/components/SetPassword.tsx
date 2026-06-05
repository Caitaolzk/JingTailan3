import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { auth } from '../utils/cloudbase';

interface SetPasswordProps {
  email: string;
  onPasswordSet: () => void;
  onSkip: () => void;
}

export default function SetPassword({ email, onPasswordSet, onSkip }: SetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('请输入密码');
      return;
    }

    // 密码规范：至少 8 位，且包含数字和字母
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!reg.test(password)) {
      setError('密码不符合规范：至少 8 位且包含数字和字母');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      // 设置用户密码
      const { error } = await auth.updateUser({ password });
      if (error) {
        throw new Error(error.message);
      }
      setSuccess(true);
      setTimeout(() => onPasswordSet(), 1500);
    } catch (err: any) {
      setError('设置密码失败：' + (err.message || '请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="w-full max-w-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#e9c349] mb-2">密码设置成功！</h2>
          <p className="text-on-surface-variant">正在前往登录页面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base p-4">
      <div className="w-full max-w-md p-8 md:p-12 border border-[#e9c349]/30 rounded-xl bg-surface-container-low">
        <div className="text-center mb-8">
          <h1 className="font-serif-garamond text-3xl text-[#e9c349] mb-2">设置登录密码</h1>
          <p className="text-sm text-on-surface-variant">
            为账号 <span className="text-[#e9c349]">{email}</span> 设置密码
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            设置密码后，您可以使用邮箱+密码直接登录
          </p>
        </div>

        {error && (
          <div className="mb-4 text-xs font-sans-manrope bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#e9c349]" /> 设置密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#e9c349]/70 mt-1.5">* 密码规范：至少 8 位，且包含数字和字母</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#e9c349]" /> 确认密码
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-on-primary bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface font-sans-manrope font-bold text-xs button-highlight transition-all uppercase tracking-widest disabled:opacity-50"
            >
              <span>{loading ? '设置中...' : '设置密码'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 text-xs text-on-surface-variant hover:text-primary transition-colors underline"
            >
              暂不设置，以后再说
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
