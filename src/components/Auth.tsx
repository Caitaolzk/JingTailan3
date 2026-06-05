import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { Palette, Mail, Lock, User, RefreshCw, Key, ArrowRight, ArrowLeft, Gem, Eye, EyeOff } from 'lucide-react';

import { auth, db } from '../utils/cloudbase';

interface AuthProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onLoginSuccess: (email: string) => void;
}

export default function Auth({
  currentScreen,
  onNavigate,
  onLoginSuccess,
}: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verifyFunction, setVerifyFunction] = useState<((token: string) => Promise<any>) | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => setCountdown(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    setValidationError('');
    setSuccessMsg('');
    setCode('');
    setIsCodeSent(false);
    setVerifyFunction(null);
    if (currentScreen === 'register') {
      setEmail(''); setPassword(''); setNickname('');
    } else if (currentScreen === 'login') {
      setEmail(''); setPassword(''); setNickname('');
    } else {
      setEmail(''); setPassword('');
    }
  }, [currentScreen]);

  // 发送注册验证码
  const sendRegisterCode = async () => {
    if (!email) {
      setValidationError('请输入邮箱地址');
      return;
    }
    if (!nickname) {
      setValidationError('请输入昵称');
      return;
    }
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('请输入有效的邮箱地址');
      return;
    }

    setValidationError('');
    setCountdown(60);
    try {
      // CloudBase 邮箱注册 - 发送验证码
      const { data, error } = await auth.signUp({
        email,
        nickname,
      });

      if (error) {
        throw new Error(error.message);
      }

      // 保存验证函数
      setVerifyFunction(() => data.verifyOtp);
      setIsCodeSent(true);
      setSuccessMsg('验证码已发送至您的邮箱，请查收');
    } catch (e: any) {
      setValidationError(e.message || '发送验证码失败');
      setCountdown(0);
    }
  };

  // 发送密码重置链接
  const sendPasswordReset = async () => {
    if (!email) {
      setValidationError('请输入邮箱地址');
      return;
    }
    setValidationError('');
    setCountdown(60);
    try {
      await auth.sendPasswordResetEmail(email);
      setSuccessMsg('密码重置链接已发送至邮箱，打开邮件内链接修改密码');
    } catch (e: any) {
      setValidationError(e.message);
      setCountdown(0);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    // 登录：邮箱+密码
    if (currentScreen === 'login') {
      if (!email || !password) {
        setValidationError('请填写邮箱地址和登录密码');
        return;
      }
      try {
        const { data, error } = await auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        onLoginSuccess(data.user?.email || email);
      } catch (err: any) {
        setValidationError('登录失败：' + (err.message || '邮箱或密码错误'));
      }
    }

    // 注册：邮箱验证码注册
    else if (currentScreen === 'register') {
      if (!isCodeSent) {
        setValidationError('请先点击【发送验证码】获取邮箱验证码');
        return;
      }
      if (!code) {
        setValidationError('请输入邮箱验证码');
        return;
      }

      try {
        if (!verifyFunction) {
          throw new Error('验证码会话已过期，请重新发送');
        }

        // 验证验证码完成注册
        const { data, error } = await verifyFunction(code);

        if (error) {
          throw new Error(error.message);
        }

        // 注册成功，创建用户资料
        await db.collection("users").add({
          nickname,
          email,
          title: '新进传承人',
          avatar: '',
          levelFiligree: 0,
          levelEnamel: 0,
          completedCount: 0,
          followersCount: 0
        });

        setSuccessMsg('注册成功！正在跳转到登录页面...');
        setTimeout(() => onNavigate('login'), 2000);
      } catch (err: any) {
        setValidationError('注册失败：' + (err.message || '验证码错误'));
      }
    }

    // 忘记密码：发送重置链接
    else if (currentScreen === 'forgot_password') {
      if (!email) {
        setValidationError('请输入邮箱地址');
        return;
      }
      try {
        await auth.sendPasswordResetEmail(email);
        setSuccessMsg('密码重置链接已发送，请查看邮箱');
      } catch (e: any) {
        setValidationError(e.message || '发送失败');
      }
    }
  };

  const getHeroImage = () => {
    if (currentScreen === 'register') return '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed (1).jpg';
    if (currentScreen === 'forgot_password') return '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed (2).png';
    return '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed (2).jpg';
  };

  return (
    <main className="flex-grow flex w-full relative min-h-screen text-on-surface font-serif-literata bg-surface-base">
      <div className="flex flex-col lg:flex-row w-full h-screen">
        <div className="hidden lg:block lg:w-1/2 relative bg-surface-container-low overflow-hidden border-r border-[#e9c349]/30">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img alt="Artisan hands filigree master craft" src={getHeroImage()} referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 mix-blend-luminosity opacity-80" />
          <div className="absolute bottom-16 left-16 z-20 pl-6 border-l-2 border-[#e9c349]">
            <h2 className="font-serif-garamond text-5xl font-extrabold text-[#e9c349] tracking-widest uppercase">景泰蓝工艺坊</h2>
            <p className="text-sm font-sans-manrope uppercase tracking-widest text-[#c4c5d5] mt-2 italic">数字化呈现的掐丝珐琅之美与皇家风范</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-lowest relative z-10 overflow-y-auto">
          <div className="w-full max-w-md p-8 md:p-12 border border-[#e9c349]/30 rounded-xl relative bg-surface-container-low enamel-surface">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#e9c349]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#e9c349]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#e9c349]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#e9c349]"></div>
            <div className="text-center mb-8">
              {currentScreen === 'login' && (<>
                <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-[#e9c349] flex items-center justify-center mx-auto mb-4"><Palette className="w-6 h-6 text-[#e9c349]" /></div>
                <h1 className="font-serif-garamond text-3xl md:text-4xl text-[#e9c349]">进入工坊</h1>
                <p className="text-xs font-sans-manrope uppercase tracking-wider text-on-surface-variant mt-2">开启您的掐丝珐琅探索之旅</p>
              </>)}
              {currentScreen === 'register' && (<>
                <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-[#e9c349] flex items-center justify-center mx-auto mb-4"><Palette className="w-6 h-6 text-[#e9c349]" /></div>
                <h1 className="font-serif-garamond text-3xl md:text-4xl text-[#e9c349]">注册工坊账号</h1>
                <p className="text-xs font-sans-manrope uppercase tracking-wider text-on-surface-variant mt-2">探索传统工艺与现代数字艺术的融合</p>
              </>)}
              {currentScreen === 'forgot_password' && (<>
                <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-[#e9c349] flex items-center justify-center mx-auto mb-4"><RefreshCw className="w-6 h-6 text-[#e9c349]" /></div>
                <h1 className="font-serif-garamond text-3xl md:text-4xl text-[#e9c349]">重置工坊密码</h1>
                <p className="text-xs font-sans-manrope uppercase tracking-wider text-on-surface-variant mt-2">输入注册邮箱以重置工坊台密码</p>
              </>)}
            </div>
            {validationError && (<div className="mb-4 text-xs font-sans-manrope bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-lg text-center">{validationError}</div>)}
            {successMsg && (<div className="mb-4 text-xs font-sans-manrope bg-green-950/40 border border-green-500/30 text-green-400 p-3 rounded-lg text-center font-bold">{successMsg}</div>)}
            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* 注册：昵称 */}
              {currentScreen === 'register' && (
                <div className="space-y-1.5">
                  <label htmlFor="nickname" className="block text-xs font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#e9c349]" /> 昵称</label>
                  <input id="nickname" type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="请输入匠人昵称"
                    className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors recessed-input" />
                </div>
              )}

              {/* 邮箱地址 - 所有页面都需要 */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#e9c349]" /> 邮箱地址</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="artisan@cloisonnecraft.com"
                  className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors recessed-input" />
              </div>

              {/* 注册：验证码输入 */}
              {currentScreen === 'register' && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="code" className="block text-xs font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-[#e9c349]" /> 邮箱验证码</label>
                    <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={isCodeSent ? "请输入6位验证码" : "请先点击发送验证码"}
                      disabled={!isCodeSent}
                      className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors recessed-input disabled:opacity-50" />
                  </div>
                  <button type="button" onClick={sendRegisterCode} disabled={countdown > 0 || !email || !nickname}
                    className="py-2.5 px-4 rounded border border-secondary text-secondary hover:bg-secondary/10 transition-colors font-sans-manrope text-xs whitespace-nowrap h-[42px] font-bold disabled:opacity-50">
                    {countdown > 0 ? `${countdown}s` : (isCodeSent ? '重新发送' : '发送验证码')}
                  </button>
                </div>
              )}

              {/* 登录：密码输入 */}
              {currentScreen === 'login' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="password" className="block font-sans-manrope tracking-widest text-[#e5e2e1] uppercase flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#e9c349]" /> 密码</label>
                    <button type="button" onClick={() => onNavigate('forgot_password')} className="font-sans-manrope text-xs text-primary hover:text-primary-container transition-colors font-bold underline">忘记密码？</button>
                  </div>
                  <div className="relative">
                    <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-surface-container-low border border-outline-variant rounded py-2.5 px-3 text-sm text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors recessed-input pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* 注册提示 */}
              {currentScreen === 'register' && (
                <div className="text-[10px] text-[#e9c349]/70 mt-1.5 bg-surface-container/50 p-2 rounded">
                  <p>📧 注册流程：</p>
                  <p>1. 输入昵称和邮箱地址</p>
                  <p>2. 点击【发送验证码】</p>
                  <p>3. 查收邮件并输入验证码</p>
                  <p>4. 点击【完成注册】</p>
                </div>
              )}

              {/* 登录：记住我 */}
              {currentScreen === 'login' && (
                <div className="flex items-center gap-2 pt-1">
                  <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary focus:ring-offset-surface border-outline-variant rounded bg-surface-container-low" />
                  <label htmlFor="remember-me" className="text-xs text-on-surface-variant font-sans-manrope">记住我的工作台登录状态</label>
                </div>
              )}

              {/* 提交按钮 */}
              <div className="pt-4">
                <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-on-primary bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface font-sans-manrope font-bold text-xs button-highlight transition-all uppercase tracking-widest">
                  <span>{currentScreen === 'login' && '登录工作台'}{currentScreen === 'register' && '完成注册'}{currentScreen === 'forgot_password' && '发送重置链接'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="flex items-center justify-center my-6 opacity-40">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e9c349] to-transparent"></div>
              <Gem className="text-[#e9c349] mx-3 w-3 h-3" />
              <div className="h-px w-full bg-gradient-to-l from-transparent via-[#e9c349] to-transparent"></div>
            </div>
            <div className="text-center font-sans-manrope text-xs">
              {currentScreen === 'login' && (<p className="text-on-surface-variant">初来乍到？{' '}<button onClick={() => onNavigate('register')} className="text-secondary hover:text-[#ffd700] transition-colors font-extrabold underline cursor-pointer">创建账号</button></p>)}
              {currentScreen === 'register' && (<p className="text-on-surface-variant">已有账号？{' '}<button onClick={() => onNavigate('login')} className="text-secondary hover:text-[#ffd700] transition-colors font-extrabold underline cursor-pointer">去登录</button></p>)}
              {currentScreen === 'forgot_password' && (<button onClick={() => onNavigate('login')} className="text-on-surface-variant hover:text-white transition-colors font-bold inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> 返回登录入口</button>)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
