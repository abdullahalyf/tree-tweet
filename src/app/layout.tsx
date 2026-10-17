import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

// Configure Noto Sans Bengali font for authentic Bengali typography
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "জমির যাচাইকরণ | LandTech AI Pre-Purchase Verification System",
  description:
    "সাধারণ জমি ক্রেতাদের জন্য কৃত্রিম বুদ্ধিমত্তা সহায়ক প্রাক-ক্রয় জমি যাচাইকরণ ব্যবস্থা (LandTech Hackathon 2026)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} font-sans`} suppressHydrationWarning>
      <head>
        {/* Intercepts browser extension mutations (Bitdefender bis_skin_checked) and suppresses false-positive hydration errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var currentError = console.error;
                  Object.defineProperty(console, 'error', {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                      return function() {
                        for (var i = 0; i < arguments.length; i++) {
                          var arg = arguments[i];
                          var str = typeof arg === 'string' ? arg : (arg && arg.message) || '';
                          if (str.indexOf('bis_skin_checked') !== -1 || str.indexOf('bis_register') !== -1 || str.indexOf('Encountered a script tag') !== -1) {
                            return;
                          }
                        }
                        return currentError.apply(console, arguments);
                      };
                    },
                    set: function(fn) {
                      currentError = fn;
                    }
                  });

                  function clean(node) {
                    if (!node || node.nodeType !== 1) return;
                    if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                    if (node.hasAttribute('bis_register')) node.removeAttribute('bis_register');
                    var els = node.querySelectorAll ? node.querySelectorAll('[bis_skin_checked], [bis_register]') : [];
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                      els[i].removeAttribute('bis_register');
                    }
                  }

                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes') {
                        if (m.attributeName === 'bis_skin_checked' || m.attributeName === 'bis_register') {
                          m.target.removeAttribute(m.attributeName);
                        }
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          clean(m.addedNodes[j]);
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
