import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '@/public/contexts/PublicContentContext';
import { submitContact } from '@/public/services/publicApi';
import { isMockMode } from '@/shared/config/runtime';
import { ApiError } from '@/shared/api/client';

type Stage = 'composing' | 'details' | 'sending' | 'sent' | 'error';

const prompts = ['how do you ship?', "what's your stack?", "what's your availability?", 'wanna chat?'];

const RESUME_URL = '/assets/documents/george-oti-adjei-cv.pdf';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ContactComposer() {
  const { content } = useContent();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('composing');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const messageRef = useRef<HTMLInputElement | null>(null);

  const socials = content.homePage?.hero?.socialIcons ?? [];
  const linkedin = socials.find((social) => social.platform.toLowerCase().includes('linkedin'));

  const applyPrompt = (prompt: string) => {
    setMessage(prompt);
    messageRef.current?.focus();
  };

  const startDetails = () => {
    if (!message.trim()) return;
    setError('');
    setStage('details');
  };

  const send = async () => {
    if (!name.trim()) {
      setError('A name helps me reply properly.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('That email address does not look right.');
      return;
    }

    setError('');
    setStage('sending');

    try {
      if (isMockMode()) {
        setReference('mock-preview');
      } else {
        const result = await submitContact({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          source: 'v2_home_composer',
          hp: honeypot,
        });
        setReference(result.referenceId);
      }
      setStage('sent');
    } catch (err) {
      console.error('Contact submission failed:', err);
      if (err instanceof ApiError && err.status === 429) {
        setError('That is a lot of messages in a short time — try again in a bit.');
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong sending that. Try again, or email me directly.');
      }
      setStage('error');
    }
  };

  const detailsStage = stage === 'details' || stage === 'sending' || stage === 'error';

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      {/* Intro bubble */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
          <img
            src="/assets/me/portrait-close.jpg"
            alt=""
            className="w-full h-full object-cover object-[50%_62%]"
          />
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-white ring-1 ring-black/5 px-4 py-3 text-[13px] text-gray-800">
          I'm Georgie — based in Accra. I build and ship cross-platform software, end to end.
        </div>
      </div>

      {/* Chips */}
      {stage === 'composing' && (
        <div className="mt-3 ml-11 flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate('/works')}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11.5px] sm:text-[12px] text-gray-700 hover:bg-gray-50 transition"
          >
            see my work ↗
          </button>

          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => applyPrompt(prompt)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11.5px] sm:text-[12px] text-gray-700 hover:bg-gray-50 transition"
            >
              {prompt}
            </button>
          ))}

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11.5px] sm:text-[12px] text-gray-700 hover:bg-gray-50 transition"
          >
            resume ↗
          </a>

          {linkedin && (
            <a
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 text-[11.5px] sm:text-[12px] text-gray-700 hover:bg-gray-50 transition"
            >
              linkedin ↗
            </a>
          )}
        </div>
      )}

      {/* Sent message echoed back */}
      {stage !== 'composing' && (
        <div className="mt-4 flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-gray-900 text-white px-4 py-3 text-[13px] whitespace-pre-wrap">
            {message}
          </p>
        </div>
      )}

      {/* Composer */}
      <form
        className="mt-5 ml-11"
        onSubmit={(e) => {
          e.preventDefault();
          if (stage === 'composing') {
            startDetails();
          } else if (detailsStage) {
            void send();
          }
        }}
      >
        {/* honeypot */}
        <input
          type="text"
          name="hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: 'none' }}
        />

        {stage === 'composing' && (
          <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 pl-4 pr-1 py-1">
            <span className="font-mono text-gray-500 select-none text-[13px]" aria-hidden="true">
              {'>_'}
            </span>
            <input
              ref={messageRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What problem are we solving?"
              aria-label="Your message"
              className="flex-1 bg-transparent font-mono text-[13px] py-2 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Continue"
              className="w-8 h-8 rounded-full bg-gray-900 text-white inline-flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <i className="ri-arrow-up-line" aria-hidden="true" />
            </button>
          </div>
        )}

        {detailsStage && (
          <div className="space-y-2">
            <p className="text-[12px] text-gray-500">Got it — who do I reply to?</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl sm:rounded-full bg-white ring-1 ring-gray-200 p-1 sm:pl-4 sm:pr-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                aria-label="Your name"
                autoComplete="name"
                className="flex-1 bg-transparent text-[13px] px-3 sm:px-0 py-2 outline-none placeholder:text-gray-400"
              />
              <span className="hidden sm:block w-px h-5 bg-gray-200" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Your email address"
                autoComplete="email"
                className="flex-1 bg-transparent text-[13px] px-3 sm:px-0 py-2 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={stage === 'sending'}
                aria-label="Send message"
                className="w-8 h-8 shrink-0 self-end sm:self-auto rounded-full bg-[#f75124] text-white inline-flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <i
                  className={stage === 'sending' ? 'ri-loader-4-line animate-spin' : 'ri-arrow-up-line'}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStage('composing');
                  setError('');
                }}
                className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
              >
                ← edit message
              </button>
              <a href="mailto:george@hearvie.dev" className="text-[12px] text-gray-400 hover:text-[#f75124] transition-colors">
                or email me directly
              </a>
            </div>
          </div>
        )}

        {stage === 'sent' && (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3">
            <p className="text-[13px] text-gray-800">
              <i className="ri-check-line text-emerald-600 mr-1.5" aria-hidden="true" />
              Sent — I'll reply to <span className="font-medium">{email}</span>.
            </p>
            <p className="mt-1 text-[11px] text-gray-400 font-mono">ref {reference}</p>
          </div>
        )}

        <div aria-live="polite" className="min-h-[1.25rem]">
          {error && <p className="mt-2 text-[12px] text-[#f75124]">{error}</p>}
        </div>
      </form>
    </div>
  );
}
