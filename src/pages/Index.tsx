import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "archive" | "statuses" | "profile" | "settings";

interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  source: "tg" | "wa";
  messages: Message[];
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
  source: "tg" | "wa";
}

interface Status {
  id: number;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  color: string;
}

const chats: Chat[] = [
  {
    id: 1, name: "Алина Морозова", avatar: "АМ", lastMessage: "Увидимся завтра в 10?", time: "14:22", unread: 3, online: true, source: "tg",
    messages: [
      { id: 1, text: "Привет! Как дела?", time: "14:10", mine: false },
      { id: 2, text: "Всё отлично, спасибо!", time: "14:12", mine: true },
      { id: 3, text: "Увидимся завтра в 10?", time: "14:22", mine: false },
    ]
  },
  {
    id: 2, name: "Команда проекта", avatar: "КП", lastMessage: "Дедлайн перенесли на пятницу", time: "13:05", unread: 0, online: false, source: "wa",
    messages: [
      { id: 1, text: "Всем привет!", time: "11:00", mine: false },
      { id: 2, text: "Дедлайн перенесли на пятницу", time: "13:05", mine: false },
    ]
  },
  {
    id: 3, name: "Дмитрий Лебедев", avatar: "ДЛ", lastMessage: "Файлы отправил на почту", time: "11:48", unread: 1, online: true, source: "tg",
    messages: [
      { id: 1, text: "Добрый день!", time: "11:30", mine: true },
      { id: 2, text: "Файлы отправил на почту", time: "11:48", mine: false },
    ]
  },
  {
    id: 4, name: "Мария Кузнецова", avatar: "МК", lastMessage: "Спасибо большое 🙏", time: "10:15", unread: 0, online: false, source: "wa",
    messages: [
      { id: 1, text: "Всё получила!", time: "10:14", mine: false },
      { id: 2, text: "Спасибо большое 🙏", time: "10:15", mine: false },
    ]
  },
  {
    id: 5, name: "Артём Волков", avatar: "АВ", lastMessage: "Звони как будет время", time: "09:30", unread: 0, online: true, source: "tg",
    messages: [
      { id: 1, text: "Эй, есть минута?", time: "09:25", mine: false },
      { id: 2, text: "Звони как будет время", time: "09:30", mine: false },
    ]
  },
];

const contacts: Contact[] = [
  { id: 1, name: "Алина Морозова", avatar: "АМ", phone: "+7 900 123-45-67", online: true, source: "tg" },
  { id: 2, name: "Артём Волков", avatar: "АВ", phone: "+7 911 234-56-78", online: true, source: "tg" },
  { id: 3, name: "Дмитрий Лебедев", avatar: "ДЛ", phone: "+7 922 345-67-89", online: true, source: "wa" },
  { id: 4, name: "Мария Кузнецова", avatar: "МК", phone: "+7 933 456-78-90", online: false, source: "wa" },
  { id: 5, name: "Николай Смирнов", avatar: "НС", phone: "+7 944 567-89-01", online: false, source: "tg" },
  { id: 6, name: "Светлана Орлова", avatar: "СО", phone: "+7 955 678-90-12", online: false, source: "wa" },
];

const statuses: Status[] = [
  { id: 1, name: "Алина Морозова", avatar: "АМ", time: "5 мин назад", viewed: false, color: "#00e5cc" },
  { id: 2, name: "Артём Волков", avatar: "АВ", time: "2 часа назад", viewed: false, color: "#7c3aed" },
  { id: 3, name: "Мария Кузнецова", avatar: "МК", time: "Вчера", viewed: true, color: "#f59e0b" },
  { id: 4, name: "Дмитрий Лебедев", avatar: "ДЛ", time: "Вчера", viewed: true, color: "#10b981" },
];

const avatarColors: Record<string, string> = {
  "АМ": "from-cyan-400 to-teal-600",
  "КП": "from-violet-400 to-purple-700",
  "ДЛ": "from-emerald-400 to-green-700",
  "МК": "from-amber-400 to-orange-600",
  "АВ": "from-indigo-400 to-blue-700",
  "НС": "from-rose-400 to-red-600",
  "СО": "from-pink-400 to-fuchsia-600",
  "ЯК": "from-indigo-500 to-violet-700",
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "tg" | "wa">("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const filteredChats = chats.filter(c => {
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = searchFilter === "all" || c.source === searchFilter;
    return matchesQuery && matchesFilter;
  });

  const filteredContacts = contacts.filter(c => {
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchesFilter = searchFilter === "all" || c.source === searchFilter;
    return matchesQuery && matchesFilter;
  });

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="wg-root">
      <div className="wg-blob wg-blob-1" />
      <div className="wg-blob wg-blob-2" />
      <div className="wg-blob wg-blob-3" />

      <div className="wg-shell">
        {/* SIDEBAR */}
        <aside className="wg-sidebar">
          <div className="wg-logo">
            <div className="wg-logo-icon">
              <span className="wg-lw">W</span><span className="wg-lg">G</span>
            </div>
            <span className="wg-logo-text">Watsgram</span>
          </div>

          <nav className="wg-nav">
            {([
              { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: totalUnread },
              { tab: "contacts", icon: "Users", label: "Контакты" },
              { tab: "statuses", icon: "Circle", label: "Статусы" },
              { tab: "archive", icon: "Archive", label: "Архив" },
              { tab: "profile", icon: "User", label: "Профиль" },
              { tab: "settings", icon: "Settings", label: "Настройки" },
            ] as { tab: Tab; icon: string; label: string; badge?: number }[]).map(item => (
              <button
                key={item.tab}
                className={`wg-nav-item${activeTab === item.tab ? " wg-nav-item--active" : ""}`}
                onClick={() => { setActiveTab(item.tab); setActiveChat(null); }}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
                {item.badge ? <span className="wg-nav-badge">{item.badge}</span> : null}
              </button>
            ))}
          </nav>

          <div className="wg-sidebar-user">
            <div className={`wg-av wg-av--sm bg-gradient-to-br ${avatarColors["ЯК"]}`}>ЯК</div>
            <div>
              <div className="wg-mini-name">Яков Климов</div>
              <div className="wg-mini-status">● в сети</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="wg-main">
          {activeChat ? (
            <div className="wg-chat-view">
              <div className="wg-chat-header">
                <button className="wg-icon-btn" onClick={() => setActiveChat(null)}>
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <div className={`wg-av wg-av--sm bg-gradient-to-br ${avatarColors[activeChat.avatar] || "from-cyan-400 to-teal-600"}`}>
                  {activeChat.avatar}
                </div>
                <div>
                  <div className="wg-chat-hname">{activeChat.name}</div>
                  <div className="wg-chat-hsub">
                    {activeChat.online
                      ? <><span className="wg-online-dot" /> в сети</>
                      : "не в сети"}
                  </div>
                </div>
                <div className="wg-chat-hactions">
                  <span className={`wg-src-badge wg-src-badge--${activeChat.source}`}>
                    {activeChat.source === "tg" ? "TG" : "WA"}
                  </span>
                  <button className="wg-icon-btn"><Icon name="Phone" size={18} /></button>
                  <button className="wg-icon-btn"><Icon name="Video" size={18} /></button>
                </div>
              </div>

              <div className="wg-messages">
                {activeChat.messages.map(msg => (
                  <div key={msg.id} className={`wg-bwrap${msg.mine ? " wg-bwrap--mine" : ""}`}>
                    <div className={`wg-bubble${msg.mine ? " wg-bubble--mine" : " wg-bubble--theirs"}`}>
                      <span>{msg.text}</span>
                      <span className="wg-btime">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wg-input-area">
                <button className="wg-icon-btn"><Icon name="Paperclip" size={18} /></button>
                <input
                  className="wg-input"
                  placeholder="Написать сообщение..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                />
                <button className="wg-send-btn"><Icon name="Send" size={16} /></button>
              </div>
            </div>
          ) : (
            <div className="wg-panel">
              <div className="wg-panel-header">
                <h1 className="wg-panel-title">
                  {activeTab === "chats" && "Чаты"}
                  {activeTab === "contacts" && "Контакты"}
                  {activeTab === "statuses" && "Статусы"}
                  {activeTab === "archive" && "Архив"}
                  {activeTab === "profile" && "Профиль"}
                  {activeTab === "settings" && "Настройки"}
                </h1>
                {(activeTab === "chats" || activeTab === "contacts") && (
                  <button className="wg-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                    <Icon name="Search" size={18} />
                  </button>
                )}
              </div>

              {searchOpen && (activeTab === "chats" || activeTab === "contacts") && (
                <div className="wg-search">
                  <div className="wg-search-row">
                    <Icon name="Search" size={16} />
                    <input
                      className="wg-search-input"
                      placeholder="Поиск по имени, тексту, номеру..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button className="wg-clear" onClick={() => setSearchQuery("")}>
                        <Icon name="X" size={14} />
                      </button>
                    )}
                  </div>
                  <div className="wg-filters">
                    {(["all", "tg", "wa"] as const).map(f => (
                      <button
                        key={f}
                        className={`wg-filter${searchFilter === f ? " wg-filter--active" : ""}`}
                        onClick={() => setSearchFilter(f)}
                      >
                        {f === "all" ? "Все" : f === "tg" ? "Telegram" : "WhatsApp"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CHATS */}
              {activeTab === "chats" && (
                <div className="wg-list">
                  {filteredChats.length === 0 && <div className="wg-empty">Ничего не найдено</div>}
                  {filteredChats.map(chat => (
                    <button key={chat.id} className="wg-chat-item" onClick={() => setActiveChat(chat)}>
                      <div className="wg-av-wrap">
                        <div className={`wg-av bg-gradient-to-br ${avatarColors[chat.avatar] || "from-cyan-400 to-teal-600"}`}>
                          {chat.avatar}
                        </div>
                        {chat.online && <span className="wg-online-ring" />}
                      </div>
                      <div className="wg-chat-info">
                        <div className="wg-chat-top">
                          <span className="wg-cname">{chat.name}</span>
                          <span className="wg-ctime">{chat.time}</span>
                        </div>
                        <div className="wg-chat-bot">
                          <span className="wg-cprev">{chat.lastMessage}</span>
                          <div className="wg-cmeta">
                            <span className={`wg-src-badge wg-src-badge--${chat.source}`}>
                              {chat.source === "tg" ? "TG" : "WA"}
                            </span>
                            {chat.unread > 0 && <span className="wg-unread">{chat.unread}</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* CONTACTS */}
              {activeTab === "contacts" && (
                <div className="wg-list">
                  {filteredContacts.length === 0 && <div className="wg-empty">Ничего не найдено</div>}
                  {filteredContacts.map(contact => (
                    <div key={contact.id} className="wg-contact-item">
                      <div className="wg-av-wrap">
                        <div className={`wg-av bg-gradient-to-br ${avatarColors[contact.avatar] || "from-cyan-400 to-teal-600"}`}>
                          {contact.avatar}
                        </div>
                        {contact.online && <span className="wg-online-ring" />}
                      </div>
                      <div className="wg-contact-info">
                        <div className="wg-cname">{contact.name}</div>
                        <div className="wg-cphone">{contact.phone}</div>
                      </div>
                      <div className="wg-contact-actions">
                        <span className={`wg-src-badge wg-src-badge--${contact.source}`}>
                          {contact.source === "tg" ? "TG" : "WA"}
                        </span>
                        <button className="wg-icon-btn"><Icon name="MessageCircle" size={16} /></button>
                        <button className="wg-icon-btn"><Icon name="Phone" size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STATUSES */}
              {activeTab === "statuses" && (
                <div className="wg-statuses-page">
                  <div className="wg-my-status">
                    <div className="wg-my-av-wrap">
                      <div className={`wg-av wg-av--lg bg-gradient-to-br ${avatarColors["ЯК"]}`}>ЯК</div>
                      <button className="wg-add-status"><Icon name="Plus" size={14} /></button>
                    </div>
                    <div>
                      <div className="wg-cname">Мой статус</div>
                      <div className="wg-cphone">Нажмите чтобы обновить</div>
                    </div>
                  </div>
                  <div className="wg-sec-title">Недавние обновления</div>
                  <div className="wg-list">
                    {statuses.map(s => (
                      <div key={s.id} className="wg-status-item">
                        <div className="wg-status-av-wrap">
                          <svg className="wg-status-ring" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="21" fill="none"
                              stroke={s.viewed ? "#3a3a5c" : s.color}
                              strokeWidth="2.5"
                              strokeDasharray={s.viewed ? "none" : "6 3"}
                            />
                          </svg>
                          <div className={`wg-av wg-av--sm bg-gradient-to-br ${avatarColors[s.avatar] || "from-cyan-400 to-teal-600"}`}>
                            {s.avatar}
                          </div>
                        </div>
                        <div>
                          <div className="wg-cname">{s.name}</div>
                          <div className="wg-cphone">{s.time}</div>
                        </div>
                        {!s.viewed && (
                          <span className="wg-status-dot" style={{ backgroundColor: s.color }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ARCHIVE */}
              {activeTab === "archive" && (
                <div className="wg-empty-page">
                  <div className="wg-empty-icon"><Icon name="Archive" size={52} /></div>
                  <div className="wg-empty-title">Архив пуст</div>
                  <div className="wg-empty-desc">Здесь будут архивные чаты</div>
                </div>
              )}

              {/* PROFILE */}
              {activeTab === "profile" && (
                <div className="wg-profile">
                  <div className="wg-profile-hero">
                    <div className="wg-profile-av-wrap">
                      <div className={`wg-av wg-av--xl bg-gradient-to-br ${avatarColors["ЯК"]}`}>ЯК</div>
                      <div className="wg-profile-glow" />
                    </div>
                    <h2 className="wg-profile-name">Яков Климов</h2>
                    <p className="wg-profile-bio">Дизайнер & разработчик</p>
                    <div className="wg-profile-badges">
                      <span className="wg-src-badge wg-src-badge--tg">Telegram</span>
                      <span className="wg-src-badge wg-src-badge--wa">WhatsApp</span>
                    </div>
                  </div>

                  <div className="wg-stats">
                    {[
                      { label: "Чатов", value: "5" },
                      { label: "Контактов", value: "6" },
                      { label: "Статусов", value: "12" },
                    ].map(s => (
                      <div key={s.label} className="wg-stat-card">
                        <div className="wg-stat-val">{s.value}</div>
                        <div className="wg-stat-lbl">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="wg-profile-fields">
                    {[
                      { icon: "Phone", label: "Телефон", value: "+7 900 000-00-00" },
                      { icon: "Mail", label: "Почта", value: "yakov@example.com" },
                      { icon: "MapPin", label: "Город", value: "Москва" },
                    ].map(f => (
                      <div key={f.label} className="wg-pfield">
                        <div className="wg-pfield-icon"><Icon name={f.icon} size={16} /></div>
                        <div className="flex-1">
                          <div className="wg-flabel">{f.label}</div>
                          <div className="wg-fvalue">{f.value}</div>
                        </div>
                        <button className="wg-icon-btn"><Icon name="Pencil" size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === "settings" && (
                <div className="wg-settings">
                  {[
                    {
                      section: "Аккаунт",
                      items: [
                        { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация, баннеры" },
                        { icon: "Lock", label: "Конфиденциальность", desc: "Кто видит мои данные" },
                        { icon: "Shield", label: "Безопасность", desc: "Двухфакторная авторизация" },
                      ]
                    },
                    {
                      section: "Интеграции",
                      items: [
                        { icon: "Zap", label: "Telegram", desc: "Подключён • @yakov_k" },
                        { icon: "Zap", label: "WhatsApp", desc: "Подключён • +7 900 000-00-00" },
                      ]
                    },
                    {
                      section: "Приложение",
                      items: [
                        { icon: "Palette", label: "Тема", desc: "Тёмная" },
                        { icon: "Globe", label: "Язык", desc: "Русский" },
                        { icon: "HelpCircle", label: "Поддержка", desc: "Написать в поддержку" },
                      ]
                    }
                  ].map(group => (
                    <div key={group.section} className="wg-settings-group">
                      <div className="wg-sec-title">{group.section}</div>
                      {group.items.map(item => (
                        <button key={item.label} className="wg-settings-item">
                          <div className="wg-settings-icon"><Icon name={item.icon} size={18} /></div>
                          <div className="flex-1 text-left">
                            <div className="wg-slabel">{item.label}</div>
                            <div className="wg-sdesc">{item.desc}</div>
                          </div>
                          <Icon name="ChevronRight" size={16} />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
