# Config store authentication

## Confirmed causes

The previous login handler imposed a maximum eight-hour lifetime, even when GitHub omitted an expiry. It discarded refresh credentials and cleared the saved access token without renewal. An old 401 response could erase a newer login. Failed initial account lookups were silently ignored, leaving Sign in visible even with credentials still saved.

These are confirmed source defects. They do not establish which event caused an individual user's sign-out.

## Current behavior

- Follow the server expiry; omitted expiry means no locally imposed deadline.
- Save and rotate access/refresh credentials together. Renew near expiry or after an early 401, with at most one authenticated retry.
- Coordinate renewal with expiring tickets in shared userscript storage and coalesce simultaneous requests in one instance.
- Keep credentials on temporary network, rate-limit and OAuth errors. A cached verified account can remain visible; API operations still require authorization from GitHub.
- Ignore obsolete responses. Do not retry writes under a different account.
- Manual sign-out requires confirmation and prevents pending renewal from restoring the session.

Credentials remain in userscript storage, never in exports, native settings, page storage or logs. Only the verified account ID and login name are cached from the profile response.

Older versions discarded refresh credentials. If an old access token has expired, authorize once after updating. Revoked authorization and expired refresh credentials still require sign-in.

Reference: [GitHub Docs, Refreshing user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens), checked 2026-11-09. Device-flow refresh does not require a client secret. Never embed a client secret in the userscript.

## Verification

Service tests cover expiry migration, token rotation, concurrent calls, two isolated instances with shared mocked GM storage, temporary failures, stale responses, account switches and expired lock tickets. Browser tests cover desktop/mobile renewal and temporary account-lookup failures.

After the final change, all 80 affected store/service/browser tests passed. The release verification passed all 637 included tests, plus build consistency, syntax, language-pack and documentation checks.

These are offline checks with simulated GitHub transport and userscript storage, not live authorization or installed-manager concurrency verification.

## 简体中文

旧代码把登录最长限制为八小时，没有保存续期凭据；到期直接清除登录。旧请求返回 401 还可能误删新登录，网络失败也可能让界面看起来已退出。

现在按服务器期限自动续期，临时失败保留凭据，过时请求不能覆盖新登录。旧版更新后可能需要重新授权一次。手动退出仍须确认。

测试使用模拟 GitHub 和 GM 存储，尚未进行真实账号的长时间续期验证。
