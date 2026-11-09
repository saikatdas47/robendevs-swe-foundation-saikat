# Day 1 — Networking, DNS, HTTP/HTTPS and Traffic Routing

Original study material: [networking diagram](Diagram.png), [rendering-pipeline diagram](Diagram%202%20rendering-pipeline.png), and [handwritten Note.pdf](Note.pdf). The images and PDF are preserved unchanged.


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

## 12. Browser Rendering and Performance (extra context)

Fast network responses alone do not guarantee a responsive page. The browser must parse HTML/CSS, run JavaScript, calculate layout, and paint pixels. Heavy JavaScript or repeated layout work can block interaction.

```text
HTML → DOM ─┐
            ├→ Layout → Paint → Screen
CSS  → CSSOM┘
```

Animating `transform` is often cheaper than animating `left`: changing `left` can trigger layout; `transform` can often move a painted element without recalculating the whole layout.


## 13. TCP/IP model and OSI mapping

The practical Internet stack is commonly taught as four TCP/IP layers. The mapping to OSI is approximate; TLS does not fit neatly into one OSI box.

| TCP/IP layer | OSI equivalent | Role | Examples |
|---|---|---|---|
| Application | 5–7 | Application messages, representation and sessions | HTTP, DNS, TLS above TCP |
| Transport | 4 | Communication between application endpoints | TCP, UDP; QUIC runs over UDP |
| Internet | 3 | Addressing and routing between networks | IPv4, IPv6, ICMP |
| Link / network access | 1–2 | Frames and physical delivery on the local link | Ethernet, Wi-Fi |

Sending encapsulates an HTTP message into transport data, IP packets, and link frames. Receiving removes those layers. Routers forward IP packets between networks; switches usually forward local frames using MAC addresses.

### Ports and sockets

An IP identifies an interface; a port helps deliver traffic to the right application. HTTP commonly uses TCP 80; HTTPS uses TCP 443 for HTTP/1.1 or HTTP/2 and UDP 443 for HTTP/3. DNS commonly uses UDP or TCP 53. These are defaults, not mandatory choices.

A socket is an operating-system communication endpoint. A listening server socket accepts TCP connections; each connection is distinguished by protocol plus source IP/port and destination IP/port. Example: `192.168.1.10:53024 → 203.0.113.20:443`. The client normally chooses an ephemeral source port. UDP sockets can send/receive datagrams without a TCP-style handshake.

Private IPv4 ranges are `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. Private addresses are not globally routed. Public addressing does not itself guarantee inbound access: firewalls and routing still matter. Common home NAT also translates ports (NAPT/PAT), tracking each mapping so replies reach the correct client. NAT is not a substitute for firewall policy. IPv6 commonly uses globally routable addresses without NAT, with firewall rules controlling access.

## 14. HTTP request, response, methods, status codes and cookies

HTTP exchanges requests and responses. This is a readable HTTP/1.1 example; HTTP/2 and HTTP/3 encode messages in binary frames while preserving HTTP semantics.

```http
GET /products?limit=10 HTTP/1.1
Host: shop.example
Accept: application/json
Cookie: session=opaque-token

```

The first line contains method, request target and version. Headers carry metadata; a blank line separates headers from an optional body. GET usually has no body. POST/PUT/PATCH often carry a body described by `Content-Type`.

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, no-cache
ETag: "products-v3"
Set-Cookie: session=opaque-token; Secure; HttpOnly; SameSite=Lax; Path=/
Content-Length: 15

{"products":[]}
```

The response has a status line, headers, a blank line, and an optional body. HEAD responses and 304 responses have no response content. HTTP/2 and HTTP/3 use pseudo-headers such as `:method`, `:path`, and `:status` instead of these text start lines.

| Method | Typical purpose | Safe? | Idempotent by semantics? |
|---|---|---|---|
| GET | Retrieve a representation | Yes | Yes |
| HEAD | GET metadata without response content | Yes | Yes |
| POST | Submit/process data or create under a collection | No | No general guarantee |
| PUT | Create/replace the target resource | No | Yes |
| PATCH | Partially modify a resource | No | Not necessarily |
| DELETE | Remove the target resource | No | Yes |
| OPTIONS | Discover communication options; used in CORS preflight | Yes | Yes |

Safe means the client does not request a state change. Idempotent means repeated identical requests have the same intended effect, not that responses must be identical. A second DELETE may return 404 after the first returns 204.

| Status | Meaning / example |
|---|---|
| 1xx | Informational, e.g. 100 Continue |
| 200 / 201 / 204 | Success / created / success without content |
| 301 / 302 | Redirect; clients may change POST to GET |
| 307 / 308 | Redirect preserving the method and body |
| 304 | Cached representation remains valid after conditional request |
| 400 / 401 / 403 / 404 | Bad request / authentication needed / forbidden / not found |
| 409 / 429 | State conflict / too many requests |
| 500 / 502 / 503 / 504 | Server error / bad upstream response / unavailable / upstream timeout |

Useful headers: `Authorization` carries credentials; `Content-Type` describes the body; `Accept` expresses preferred response types; `Location` identifies a redirect or created resource; `Retry-After` suggests when to retry. CORS response headers control browser cross-origin access; they do not replace authentication.

HTTP itself is stateless. A server can set a cookie with `Set-Cookie`; the browser later sends matching cookies in `Cookie`. `Secure` restricts sending to secure connections, `HttpOnly` prevents JavaScript access, and `SameSite` helps control cross-site sending. Domain/path/expiry affect cookie scope and lifetime. Cookies may hold a session identifier while the actual session lives on the server. Cookie presence does not automatically make shared caching safe.

See [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

## 15. TLS 1.3 handshake in detail

For a normal full certificate-authenticated TLS 1.3 handshake over an established TCP connection:

```text
Client                                        Server
  | ClientHello: supported versions, key share,   |
  | SNI (server name), ALPN (HTTP protocol) ------>|
  |<----- ServerHello: version and key share      |
  |        Both derive handshake keys            |
  |<----- EncryptedExtensions, Certificate,       |
  |       CertificateVerify, Finished             |
  | Validate certificate chain, hostname, dates;  |
  | verify signature and Finished                |
  | Finished ----------------------------------->|
  |<========== encrypted HTTP traffic ===========>|
```

The key exchange derives shared secrets; the certificate authenticates the server and its signature proves possession of the corresponding private key. The certificate does not itself encrypt every HTTP message. Most handshake messages after ServerHello are encrypted. A HelloRetryRequest can add a round trip; optional client certificates authenticate the client. Resumption may use a pre-shared key. Optional 0-RTT early data has replay risks and must be restricted appropriately.

Each TLS-terminating hop is a separate secure connection. Re-encrypting CDN-to-origin requires validating the origin certificate too. An L4 balancer can pass encrypted traffic through without terminating TLS; an L7 component must have access to decrypted HTTP to inspect its host/path/headers. The application can terminate TLS directly, and database connections can use their own TLS session.

See [TLS 1.3 specification](https://datatracker.ietf.org/doc/rfc9846/) and the [original RFC 8446 handshake](https://www.rfc-editor.org/rfc/rfc8446.html#section-2).

## 16. HTTP caching in detail

| Directive | Meaning |
|---|---|
| `max-age=60` | Freshness lifetime of 60 seconds, accounting for response age |
| `s-maxage=300` | Shared-cache freshness lifetime; overrides max-age there |
| `public` | Explicitly permits shared caching, subject to other rules |
| `private` | Shared caches must not store; a browser cache may |
| `no-cache` | May store, but must validate before reuse |
| `no-store` | Must not store this exchange |

Example for a public resource: `Cache-Control: public, max-age=60, s-maxage=300`. Cache keys typically include URI and method; `Vary: Accept-Encoding` makes representation selection also depend on that request header. CDN configuration must preserve correct keys, query parameters and personalization boundaries. Authenticated responses have additional shared-cache restrictions.

An ETag is an opaque representation validator, not necessarily a hash. After freshness expires, a client can send `If-None-Match: "products-v3"`. An unchanged representation yields 304 with metadata so the client can reuse its stored body; otherwise the origin sends a new representation. Changing content does not instantly purge every cache: use suitable TTLs, versioned static URLs or explicit CDN invalidation.

See [HTTP caching, RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html).

## 17. HTTP/1.1 vs HTTP/2 vs HTTP/3

| Property | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC over UDP |
| Representation | Text start lines/headers | Binary frames; HPACK headers | Binary frames; QPACK headers |
| Concurrent requests | Usually several TCP connections; pipelining uncommon | Multiplexed streams on one connection | Multiplexed QUIC streams |
| Head-of-line (HOL) blocking | Pipelined responses must stay in order | TCP loss delays all streams awaiting missing bytes | Loss on one stream does not force unrelated streams to await those bytes |
| Security | HTTPS adds TLS | Browsers generally use TLS | QUIC integrates TLS 1.3 |

Multiplexing interleaves frames from independent exchanges. HTTP/2 removes HTTP/1.1 response-order blocking between streams, but TCP still delivers one ordered byte stream. QUIC delivers stream data independently; bytes within an individual stream remain ordered. HTTP/3 does not eliminate congestion, shared bandwidth, application dependencies, or every possible header-decoding delay. If UDP is blocked, a client can attempt HTTP over TCP.

See [HTTP/2, RFC 9113](https://www.rfc-editor.org/rfc/rfc9113.html) and [HTTP/3, RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html).

## 18. Connection reuse, flow control and congestion control

HTTP/1.1 connections are persistent by default unless closed; the `Connection: keep-alive` header is not required. HTTP/2 and HTTP/3 reuse connections for many streams and do not use HTTP/1.1 connection-specific headers. Proxies and application servers can pool upstream connections, and applications should pool database connections. Reuse avoids repeated connection setup and reduces pressure on ports and servers.

HTTP persistence differs from TCP keepalive probes, which can help detect dead idle peers. Idle timeouts still apply at clients, NATs, proxies and servers; mismatched timeouts can produce resets when a pool reuses a stale connection.

- **Flow control protects the receiver:** TCP advertises a receive window; HTTP/2 adds stream and connection windows, and QUIC has stream/connection flow-control limits.
- **Congestion control protects the network:** TCP and QUIC adjust sending rates based on network signals such as loss or ECN. Receive capacity and network capacity are different constraints.
- The usable sending rate is constrained by both. Opening many connections does not create bandwidth and can increase contention.

See [TCP, RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) and [QUIC, RFC 9000](https://www.rfc-editor.org/rfc/rfc9000.html).

## 19. DNS-based routing and failure behaviour

An authoritative DNS service can return endpoints selected by geography, latency, weights or health-check policies. Failover usually changes answers for new lookups; it does not move an existing TCP/QUIC connection or an in-flight request.

Example: a resolver caches origin A for 300 seconds. A fails after 30 seconds. Even if health checks remove A immediately, that resolver may keep returning A for roughly another 270 seconds. Some resolvers can serve stale records during DNS failures; client/application caching can also affect timing. A low TTL reduces normal cache persistence but adds lookup load and is not an instant-failover guarantee.

DNS failure modes include a failed recursive resolver, unreachable authoritative servers, timeouts, `SERVFAIL`, and cached negative responses such as `NXDOMAIN`. Existing cached usable records or open connections may allow some traffic to continue while new clients fail. Health checks can miss region-specific outages or detect failure late. Multiple returned addresses do not guarantee all clients will retry them successfully.

Use redundant authoritative DNS, suitable health checks, explicit client deadlines and retry behaviour, and service-level failover where needed. Test failure from multiple locations instead of assuming the TTL equals recovery time.

See [DNS, RFC 1034](https://www.rfc-editor.org/rfc/rfc1034.html), [negative caching, RFC 2308](https://www.rfc-editor.org/rfc/rfc2308.html), and [serving stale DNS, RFC 8767](https://www.rfc-editor.org/rfc/rfc8767.html).

## 20. Gateway bottlenecks and connection exhaustion

A gateway can saturate before the application: TLS handshakes consume CPU; request bodies and buffers consume memory; each connection uses file descriptors; authentication, logging and filtering add work. Bandwidth, worker limits, upstream connection pools and concurrent HTTP/2/3 stream limits also constrain capacity.

Connection exhaustion can come from too many long-lived clients, slow uploads, leaked sockets, excessive retries, or many new upstream connections. Outbound ephemeral ports, NAT connection-tracking entries and TIME_WAIT occupancy can constrain new connections. A full database pool can cause waiting requests to accumulate throughout the chain.

For a steady workload, average in-flight requests are approximately arrival rate × average latency. At 1,000 requests/second and 2 seconds average latency, about 2,000 requests are in flight; these are requests, not necessarily 2,000 TCP connections because protocols can multiplex them.

Mitigate with bounded pools and queues, sensible idle/header/body/upstream timeouts, body-size and concurrency limits, connection reuse, admission control, and capacity planning. Rate limits bound arrivals; concurrency limits bound active work. Scale based on the constrained resource. Monitor active connections, queue/pool wait, file descriptors, CPU/memory, handshake rate, error rate, and p95/p99 latency. Increasing a connection limit alone may just move the bottleneck to the database.

### Reliability rules along the path

Set separate connection/TLS and response deadlines within a total request budget. A gateway timeout does not prove the backend stopped: the operation may already have committed. Propagate cancellation where supported.

Retry only suitable transient failures with a small attempt limit, exponential backoff and jitter. Respect `Retry-After` when supplied. Avoid retrying independently at every layer: three attempts at each of three layers can amplify to 27 backend attempts. A payment POST needs server-enforced idempotency, including atomic key/result storage and a policy for conflicting payloads. Rate limiting often returns 429; overload may instead cause 503 or connection refusal.

## 21. Research task and request-path deliverable

Open [the full request-path diagram](request-path.md). It shows DNS separately from the HTTP path, the complete request/response route, TLS termination or pass-through, and cache locations. This is an illustrative architecture, not a claim that these components were deployed or tested.

Trace a cold-cache request to `https://shop.example/products`, then explain how each of these changes the path:

1. The browser has a fresh cached response.
2. The browser misses but the CDN cache hits.
3. The ETag matches during revalidation.
4. The database commits a POST but the client times out.
5. Origin A fails while its DNS answer remains cached.
6. The gateway's upstream pool is full.

Expected reasoning: (1) no network request is needed; (2) the origin is skipped; (3) a 304 permits cached-body reuse; (4) a retry needs operation-level idempotency; (5) some new connections still target A until clients refresh or choose an alternative; (6) bounded waiting, deadlines and overload handling prevent unbounded buildup. These are study scenarios; no live failure experiment has been performed.
