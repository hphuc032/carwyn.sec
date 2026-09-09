"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { terminalCommands, type TerminalCommand, type TerminalContent, type TerminalResponse } from "./types";

const MAX_HISTORY = 50;
type HistoryRecord = { id: number; command: string; response: TerminalResponse };

function navigateHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const targetUrl = new URL(href, window.location.href);
  if (targetUrl.origin !== window.location.origin || targetUrl.pathname !== window.location.pathname || !targetUrl.hash) return;
  const destination = document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
  if (!destination) return;
  event.preventDefault();
  window.history.pushState(null, "", targetUrl.hash);
  destination.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  if (!destination.hasAttribute("tabindex")) destination.setAttribute("tabindex", "-1");
  destination.focus({ preventScroll: true });
}

function Response({ response }: { response: TerminalResponse }) {
  return <div className="terminal-response">
    {response.heading && <p className="terminal-response-heading">{response.heading}</p>}
    {response.lines?.map(line => <p key={line}>{line}</p>)}
    {!!response.entries?.length && <ul>{response.entries.map(entry => <li key={`${entry.label}-${entry.detail ?? ""}`}>
      {entry.href ? <Link href={entry.href} prefetch={false}>{entry.label}<span aria-hidden="true"> ↗</span></Link> : <strong>{entry.label}</strong>}
      {entry.detail && <span>{entry.detail}</span>}
    </li>)}</ul>}
    {response.action && <Link className="terminal-action" href={response.action.href!} prefetch={false} onClick={event => navigateHash(event, response.action!.href!)}>{response.action.label}<span aria-hidden="true"> →</span></Link>}
  </div>;
}

export function TerminalConsole({ content }: { content: TerminalContent }) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const nextId = useRef(0);
  const output = useRef<HTMLDivElement>(null);

  const helpResponse = useMemo<TerminalResponse>(() => ({
    heading: content.availableHeading,
    entries: terminalCommands.map(command => ({ label: command, detail: content.commandDescriptions[command] })),
    announcement: `${terminalCommands.length} ${content.availableHeading.toLocaleLowerCase()}`,
  }), [content]);

  useEffect(() => {
    const region = output.current;
    if (region) region.scrollTop = region.scrollHeight;
  }, [history]);

  function clear() {
    setHistory([]);
    setCommandHistory([]);
    setHistoryCursor(0);
    setAnnouncement(content.clearedAnnouncement);
  }

  function execute(raw: string) {
    const commandText = raw.trim().slice(0, 64);
    if (!commandText) return;
    const normalized = commandText.toLocaleLowerCase("en-US");
    if (normalized === "clear") {
      clear();
      return;
    }
    const isCommand = terminalCommands.includes(normalized as TerminalCommand);
    const response = normalized === "help"
      ? helpResponse
      : isCommand
        ? content.responses[normalized as keyof typeof content.responses]
        : {
            lines: [`${content.invalidPrefix}: ${commandText}`, content.invalidHint],
            announcement: `${content.invalidPrefix}: ${commandText}`,
          };
    setHistory(records => [...records, { id: nextId.current++, command: commandText, response }].slice(-MAX_HISTORY));
    setCommandHistory(commands => [...commands, commandText].slice(-MAX_HISTORY));
    setHistoryCursor(Math.min(commandHistory.length + 1, MAX_HISTORY));
    setAnnouncement(response.announcement);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    execute(value);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.ctrlKey && !event.altKey && !event.metaKey && event.key.toLocaleLowerCase() === "l") {
      event.preventDefault();
      clear();
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!commandHistory.length) return;
    if (event.key === "ArrowUp") {
      const next = Math.max(0, historyCursor - 1);
      setHistoryCursor(next);
      setValue(commandHistory[next] ?? "");
      return;
    }
    const next = Math.min(commandHistory.length, historyCursor + 1);
    setHistoryCursor(next);
    setValue(next === commandHistory.length ? "" : (commandHistory[next] ?? ""));
  }

  return <div className="terminal-console" data-native-cursor>
    <div className="terminal-console-bar"><span>CARWYN.SEC / LOCAL INTERFACE</span><span>{content.ready}</span></div>
    <div ref={output} className="terminal-output" tabIndex={0} aria-label={content.outputLabel}>
      <div className="terminal-welcome"><p>{content.ready}</p><p>{content.instruction}</p></div>
      <ol>{history.map(record => <li key={record.id}>
        <p className="terminal-command"><span>{content.prompt}</span> {record.command}</p>
        <Response response={record.response} />
      </li>)}</ol>
    </div>
    <form className="terminal-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="terminal-command">{content.inputLabel}</label>
      <span aria-hidden="true">{content.prompt}</span>
      <input id="terminal-command" name="command" value={value} onChange={event => setValue(event.target.value)} onKeyDown={handleKeyDown}
        autoComplete="off" autoCapitalize="none" enterKeyHint="send" maxLength={64} spellCheck={false} />
    </form>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
