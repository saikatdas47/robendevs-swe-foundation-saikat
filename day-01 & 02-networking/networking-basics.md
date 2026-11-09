# Networking Basics — Beginner Notes

## 1. IPv4 vs IPv6

An **IP address** identifies a device/interface on a network.

| | IPv4 | IPv6 |
|---|---|---|
| Size | 32 bits | 128 bits |
| Example | `192.168.1.10` | `2001:db8::10` |
| Why IPv6? | IPv4 addresses are limited | Much larger address space |

Networks often support both during the transition.

## 2. Private IP, Public IP, NAT, DHCP, Gateway

- **Private IP:** Used inside a local network, e.g. `192.168.0.105`.
- **Public IP:** Address visible to the internet, often assigned to the router.
- **NAT:** Router maps local devices' private addresses/connections to its public IP and sends replies back to the right device.
- **DHCP:** Automatically gives a device its local IP settings (IP, subnet mask, gateway, DNS).
- **Default gateway:** Usually the router's local IP, e.g. `192.168.0.1`; the device sends traffic there when going outside its local network.
- **IP block/subnet:** A range of addresses, e.g. `192.168.0.0/24`.

```text
Laptop 192.168.0.105 ──► Router/Gateway (NAT) ──► Internet (public IP)
       DHCP gives IP       sends traffic onward
```

## 3. OSI Model

A learning model for how network communication is organized, from user-facing data down to signals.

| Layer | Name | Simple role / examples |
|---:|---|---|
| 7 | Application | App protocols, e.g. HTTP, DNS |
| 6 | Presentation | Data format, encryption, compression |
| 5 | Session | Organizes communication sessions |
| 4 | Transport | End-to-end delivery; TCP, UDP, ports |
| 3 | Network | IP addressing and routing |
| 2 | Data Link | Local network delivery; MAC, switches |
| 1 | Physical | Radio, cable, fiber, electrical/light signals |

## 4. TCP, UDP, and TCP Handshake

**TCP** provides ordered, reliable delivery and retransmits missing data. Common for HTTP/1.1 and HTTP/2.

**UDP** sends datagrams without TCP's delivery/order guarantees. Common for DNS queries and real-time traffic. DNS can use TCP too; HTTP/3 uses QUIC over UDP.

```text
TCP three-way handshake:
Client ── SYN ──► Server
Client ◄─ SYN-ACK ─ Server
Client ── ACK ──► Server
       Connection ready
```

## 5. IPv4 Subnetting

A prefix tells how many of the 32 bits identify the network. The rest identify addresses within it.

```text
192.168.1.70/26
/26 mask = 255.255.255.192
Block size = 256 - 192 = 64
Blocks: 0–63, 64–127, 128–191, 192–255
```

`192.168.1.70` belongs to the `64–127` block:

```text
Network:      192.168.1.64
First host:   192.168.1.65
Last host:    192.168.1.126
Broadcast:    192.168.1.127
```

### Useful subnetting formulas

```text
Host bits = 32 - prefix
Total addresses = 2^(host bits)
Usable hosts (usual IPv4 subnet) = total addresses - 2
Block size = 256 - mask value in the changing octet
```

The usual `-2` excludes the network and broadcast addresses. `/31` point-to-point links are a special case.

### Equal-size subnet example

Split `192.168.1.0/26` into four equal subnets. `/26` has 64 addresses; each gets 16, so the new prefix is `/28`.

| Subnet | Network | First host | Last host | Broadcast |
|---:|---|---|---|---|
| 1 | `192.168.1.0/28` | `.1` | `.14` | `.15` |
| 2 | `192.168.1.16/28` | `.17` | `.30` | `.31` |
| 3 | `192.168.1.32/28` | `.33` | `.46` | `.47` |
| 4 | `192.168.1.48/28` | `.49` | `.62` | `.63` |

Exactly 3 or 5 equal subnets cannot divide a 64-address `/26` block into equal power-of-two CIDR blocks. Borrow enough bits to create at least that many equal subnets: 3 needs 4 `/28` blocks (use 3); 5 needs 8 `/29` blocks (use 5).

### VLSM example

VLSM assigns different subnet sizes to fit different host needs. Allocate the largest need first. From `192.168.10.0/24`:

| Hosts needed | Prefix | Network | First host | Last host | Broadcast |
|---:|---:|---|---|---|---|
| 60 | `/26` | `192.168.10.0` | `.1` | `.62` | `.63` |
| 50 | `/26` | `192.168.10.64` | `.65` | `.126` | `.127` |
| 20 | `/27` | `192.168.10.128` | `.129` | `.158` | `.159` |
| 10 | `/28` | `192.168.10.160` | `.161` | `.174` | `.175` |

## 6. DNS: Resolution, Records, TTL, Caching

DNS finds the IP address associated with a domain name.

```text
Browser asks for example.com
        │
        ▼
DNS resolver checks cache ── hit ──► returns IP
        │ miss
        ▼
Root → TLD (e.g. .com) → authoritative DNS
        │
        └──────────────────────────► returns IP
```

- **A:** name → IPv4 address.
- **AAAA:** name → IPv6 address.
- **CNAME:** one DNS name aliases another name.
- **MX:** identifies mail servers for a domain (with priorities).
- **TTL:** how long a DNS answer may be cached. After it expires, the resolver can look it up again. Old cached answers may remain until expiry after a change.

## 7. HTTPS and TLS

HTTPS is HTTP protected by TLS. TLS encrypts traffic and helps the client verify the server's identity.

- **Certificate:** Connects a domain identity with a public key; the browser validates it and its trust chain.
- **TLS 1.3 handshake:** Client and server agree on cryptographic settings and establish shared session keys; then application traffic is encrypted.
- **TLS termination:** A CDN, load balancer, or proxy may decrypt HTTPS and forward the request onward. The next connection can use HTTPS too (re-encryption) or, in some setups, HTTP within a trusted network.
- **Expired certificate:** Clients may reject the HTTPS connection, causing browser warnings or API failures. Monitor certificate expiry and renew ahead of time.

```text
Browser ── HTTPS ──► CDN [TLS may terminate]
                         ── HTTPS ──► Proxy [may terminate]
                                           ── HTTP/HTTPS ──► App
```

## 8. HTTP Caching

A cache stores a response copy to reuse it and avoid fetching/regenerating it each time.

- **`Cache-Control`:** Cache rules, e.g. `max-age=3600` or `no-store`.
- **ETag:** Version identifier for a response. Client can revalidate; unchanged content can get `304 Not Modified`.
- **Browser cache:** Stores eligible responses on the user's device.
- **CDN/edge cache:** Stores eligible content near users. A cache hit can answer without reaching the origin app.

Use care with personalized or sensitive responses; cache rules must prevent one user's data being served to another.

## 9. Traffic Components

```text
Browser → CDN/WAF → Load balancer / Reverse proxy → API gateway → App → Database
```

- **CDN:** Serves cached content from nearby locations.
- **WAF:** Filters web requests against configured security rules.
- **Reverse proxy:** Receives requests in front of backend servers and forwards them.
- **Load balancer:** Distributes requests across multiple servers and can avoid unhealthy ones.
- **API gateway:** Front door for APIs; can handle routing, authentication, and rate limits.
- **L4 load balancing:** Routes using IP and TCP/UDP port information.
- **L7 load balancing:** Routes using application data such as HTTP host, path, or headers.

These roles can be combined in one product or split across products; the exact order varies by architecture.

## 10. Full Request Path, Responses, TLS, and Caches

Example architecture (not every site has every component):

```text
REQUEST  ─────────────────────────────────────────────────────────►

[Browser / Client]
       │ HTTPS request
       ▼
[CDN / WAF]  ⚡ (2) CDN Edge Cache  [TLS may terminate here]
       │ HTTPS request (or another protected connection)
       ▼
[Load Balancer / Reverse Proxy]  ⚡ (3) Proxy Cache  [TLS may terminate here]
       │ HTTP or HTTPS
       ▼
[Web / Application Server]  ⚡ (4) App Cache (memory / Redis)
       │ SQL / NoSQL query
       ▼
[Database]  ⚡ (5) Buffer Pool

RESPONSE  ◄─────────────────────────────────────────────────────────

[Browser / Client]  ⚡ (1) Browser Cache
       ▲ HTTPS response
       │
[CDN / WAF]  ⚡ CDN Edge Cache
       ▲ response
       │
[Load Balancer / Reverse Proxy]  ⚡ Proxy Cache
       ▲ response
       │
[Web / Application Server]  ⚡ App Cache
       ▲ query result
       │
[Database]  ⚡ Buffer Pool
```

A cache hit may return a response early: browser cache can avoid a network request; CDN cache can avoid the origin; app cache can avoid a database query. Database buffer pools keep frequently used data in memory.

## 11. Reliability Basics

- **Timeout:** Stop waiting after a defined period instead of waiting forever.
- **Retry:** Try again after a temporary failure; limit retries and use backoff to avoid overloading a struggling service.
- **Idempotency:** Repeating an operation has the same effect as doing it once. Idempotency keys help prevent duplicate actions (e.g. charging a payment twice) when retrying.
- **Rate limiting:** Restricts requests per client/time window; excess requests may receive `429 Too Many Requests`.

## 12. Browser Rendering and Performance

Fast network responses alone do not guarantee a responsive page. The browser must parse HTML/CSS, run JavaScript, calculate layout, and paint pixels. Heavy JavaScript or repeated layout work can block interaction.

```text
HTML → DOM ─┐
            ├→ Layout → Paint → Screen
CSS  → CSSOM┘
```

Animating `transform` is often cheaper than animating `left`: changing `left` can trigger layout; `transform` can often move a painted element without recalculating the whole layout.
