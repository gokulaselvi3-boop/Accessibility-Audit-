## System Architecture Diagram

```mermaid
flowchart LR
    A[User] --> B[Client<br>HTML CSS JavaScript]
    B --> C[Server / API<br>Node.js]
    C --> D[Audit Results]
    D --> B
    B --> A
