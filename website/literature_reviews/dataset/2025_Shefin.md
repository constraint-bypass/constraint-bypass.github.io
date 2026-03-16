# 2025 Shefin
## xSRL: Safety-Aware Explainable Reinforcement Learning
Safety as a Product of Explainability

Problem
- RL을 실제 시스템(자율주행, 로봇 등)에 적용하려면 안전성이 중요
- RL policy는 왜 그런 행동을 했는지 이해하기 어렵다
- 질문: RL이 안전하게 동작하는지 사람이 이해할 수 있도록 설명할 수 있을까?

Core Claim
Explainability → Safety

Overview (xSRL)
- Global explanation + Local explanation 결합
- policy 이해 + 위험 상태 탐지 + debugging + safety patch 가능

Global Explanation (CAPS 기반)
- RL policy를 abstraction graph로 요약
- state clustering → abstract state 생성
- node = abstract state
- edge = action transition

Example
Start → Near obstacle → Safe path → Goal

Local Explanation
각 state-action에 두 가지 값 제공

Qtask(s,a)
- 목표 달성 가치

Qrisk(s,a)
- safety violation 위험

State Example
Near obstacle
Qtask = 82
Qrisk = 70

Explanation Graph
Graph G = (V,E)

V = abstract states
E = actions

node 정보
- Qtask
- Qrisk

Example
Near obstacle
  └ move south (safety decision)
      ↓
   Safe path

How Explanation is Used
1) Policy 이해
2) 위험 상태 탐지 (Qrisk > ε)
3) Adversarial attack 분석
4) Safety patch

Safety Shield
if Qrisk > Tsafety:
    use safety policy
else:
    use task policy

Key Idea
State abstraction
+ policy graph
+ Qtask / Qrisk annotation