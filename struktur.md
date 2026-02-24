src/
├── app/
│ ├── (auth)/
│ │ ├── login/page.tsx
│ │ ├── register/page.tsx
│ │ └── layout.tsx
│ │
│ ├── (public)/
│ │ ├── ambil-antrian/page.tsx
│ │ └── status-antrian/page.tsx
│ │
│ ├── (dashboard)/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │
│ │ ├── antrian/page.tsx
│ │ ├── pemanggilan/page.tsx
│ │ ├── loket/page.tsx
│ │
│ │ ├── shift/
│ │ │ ├── template/page.tsx
│ │ │ └── harian/page.tsx
│ │
│ │ ├── users/page.tsx
│ │ └── laporan/page.tsx
│ │
│ ├── api/
│ │ ├── auth/
│ │ │ └── [...nextauth]/route.ts
│ │ │
│ │ ├── users/route.ts
│ │ ├── counters/route.ts
│ │ ├── shifts/route.ts
│ │ ├── shift-templates/route.ts
│ │ ├── shift-assignments/route.ts
│ │ └── queues/
│ │ ├── route.ts
│ │ └── call/route.ts
│ │
│ ├── layout.tsx
│ ├── loading.tsx
│ ├── error.tsx
│ └── not-found.tsx
│
├── modules/ # DOMAIN (SERVER ONLY)
│ ├── auth/
│ │ ├── auth.service.ts
│ │ ├── auth.guard.ts
│ │ ├── auth.types.ts
│ │ ├── auth.schema.ts
│ │ └── password.util.ts
│ │
│ ├── user/
│ │ ├── user.entity.ts
│ │ ├── user.repository.ts
│ │ ├── user.service.ts
│ │ ├── user.schema.ts
│ │ └── user.types.ts
│ │
│ ├── counter/
│ │ ├── counter.entity.ts
│ │ ├── counter.repository.ts
│ │ ├── counter.service.ts
│ │ └── counter.types.ts
│ │
│ ├── shift/
│ │ ├── shift.entity.ts
│ │ ├── shift.repository.ts
│ │ ├── shift.service.ts
│ │ └── shift.types.ts
│ │
│ ├── shift-template/
│ │ ├── shiftTemplate.entity.ts
│ │ ├── shiftTemplate.repository.ts
│ │ ├── shiftTemplate.service.ts
│ │ └── shiftTemplate.types.ts
│ │
│ ├── shift-assignment/
│ │ ├── shiftAssignment.entity.ts
│ │ ├── shiftAssignment.repository.ts
│ │ ├── shiftAssignment.service.ts
│ │ └── shiftAssignment.types.ts
│ │
│ └── queue/
│ ├── queue.entity.ts
│ ├── queue.repository.ts
│ ├── queue.service.ts
│ ├── queue.logic.ts
│ └── queue.types.ts
│
├── core/ # INFRA & SHARED
│ ├── database/
│ │ ├── mysql.ts
│ │ └── transaction.ts
│ │
│ ├── http/
│ │ ├── api-response.ts
│ │ └── http-error.ts
│ │
│ ├── auth/
│ │ ├── next-auth.ts
│ │ └── rbac.ts
│ │
│ └── env.ts
│
├── components/
│ ├── ui/
│ │ ├── Button.tsx
│ │ ├── Badge.tsx
│ │ ├── Modal.tsx
│ │ └── Toaster.tsx # sonner
│ │
│ ├── tables/
│ │ ├── QueueTable.tsx
│ │ └── UserTable.tsx
│ │
│ ├── antrian/
│ │ ├── QueueCard.tsx
│ │ └── QueueCaller.tsx
│ │
│ └── layout/
│ ├── Sidebar.tsx
│ └── Navbar.tsx
│
├── services/ # CLIENT API (FETCH)
│ ├── http.service.ts
│ ├── queue.api.ts
│ ├── user.api.ts
│ └── counter.api.ts
│
├── hooks/
│ ├── useQueue.ts
│ └── useAuth.ts
│
├── utils/
│ ├── date.ts
│ ├── antrian.ts
│ └── formatter.ts
│
├── types/
│ ├── enums.ts
│ └── api.ts
│
├── middleware.ts
│
└── tests/
├── queue.test.ts
└── shift.test.ts
