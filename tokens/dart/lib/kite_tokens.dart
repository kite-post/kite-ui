// Згенеровано scripts/build-tokens.ts з tokens/*.json. Не редагувати руками.
// Ті самі токени для kite-mobile (5.2): Flutter-пакет kite_tokens, git-залежність за тегом kite-ui.
// ignore_for_file: public_member_api_docs

import 'package:flutter/painting.dart';

abstract final class KitePalette {
  static const coral50 = Color(0xFFFFF4F1);
  static const coral100 = Color(0xFFFFE7E0);
  static const coral200 = Color(0xFFFFCEC1);
  static const coral300 = Color(0xFFFFAD98);
  static const coral400 = Color(0xFFFF8265);
  static const coral500 = Color(0xFFFF5A36);
  static const coral600 = Color(0xFFDE4323);
  static const coral700 = Color(0xFFB93218);
  static const coral800 = Color(0xFF942512);
  static const coral900 = Color(0xFF6C170B);
  static const coral950 = Color(0xFF4A0C05);
  static const sky50 = Color(0xFFF3F7FF);
  static const sky100 = Color(0xFFE3EDFF);
  static const sky200 = Color(0xFFC7DAFF);
  static const sky300 = Color(0xFFA3C1FF);
  static const sky400 = Color(0xFF79A4FF);
  static const sky500 = Color(0xFF5A8DFF);
  static const sky600 = Color(0xFF2E6BFF);
  static const sky700 = Color(0xFF2858D1);
  static const sky800 = Color(0xFF1E46A8);
  static const sky900 = Color(0xFF13327D);
  static const sky950 = Color(0xFF0B2158);
  static const green50 = Color(0xFFEEFAF3);
  static const green100 = Color(0xFFDBF5E6);
  static const green200 = Color(0xFFBBE9D0);
  static const green300 = Color(0xFF90D9B3);
  static const green400 = Color(0xFF62C596);
  static const green500 = Color(0xFF40B582);
  static const green600 = Color(0xFF1F9D6B);
  static const green700 = Color(0xFF1A8057);
  static const green800 = Color(0xFF116544);
  static const green900 = Color(0xFF06472E);
  static const green950 = Color(0xFF022F1D);
  static const amber50 = Color(0xFFFDF6EA);
  static const amber100 = Color(0xFFFDEDD3);
  static const amber200 = Color(0xFFFADCAE);
  static const amber300 = Color(0xFFF6C57E);
  static const amber400 = Color(0xFFF2A93B);
  static const amber500 = Color(0xFFDD9413);
  static const amber600 = Color(0xFFBC7A00);
  static const amber700 = Color(0xFF9B6200);
  static const amber800 = Color(0xFF7B4B00);
  static const amber900 = Color(0xFF583300);
  static const amber950 = Color(0xFF3A1F00);
  static const red50 = Color(0xFFFFF4F4);
  static const red100 = Color(0xFFFFE6E7);
  static const red200 = Color(0xFFFFCCCE);
  static const red300 = Color(0xFFFFA9AF);
  static const red400 = Color(0xFFFF7B8A);
  static const red500 = Color(0xFFFA556F);
  static const red600 = Color(0xFFD93F5A);
  static const red700 = Color(0xFFC01242);
  static const red800 = Color(0xFF902338);
  static const red900 = Color(0xFF6A1626);
  static const red950 = Color(0xFF490C18);
  static const slate50 = Color(0xFFF8FAFD);
  static const slate100 = Color(0xFFF1F4F7);
  static const slate200 = Color(0xFFE3E6EC);
  static const slate300 = Color(0xFFD0D4DC);
  static const slate400 = Color(0xFFA4ABB8);
  static const slate500 = Color(0xFF788190);
  static const slate600 = Color(0xFF545E6F);
  static const slate700 = Color(0xFF384355);
  static const slate800 = Color(0xFF222E42);
  static const slate900 = Color(0xFF142033);
  static const slate950 = Color(0xFF0E1A2B);
  static const slate975 = Color(0xFF0B1220);
  static const white = Color(0xFFFFFFFF);
  static const paper = Color(0xFFF7F4EE);
  static const snow = Color(0xFFEEF2F7);
  static const black = Color(0xFF000000);
}

final class KiteColorScheme {
  const KiteColorScheme({
    required this.bg,
    required this.bgSubtle,
    required this.surface,
    required this.surfaceRaised,
    required this.surfaceSunken,
    required this.surfaceHover,
    required this.surfaceActive,
    required this.surfaceInverse,
    required this.scrim,
    required this.raisedBorder,
    required this.text,
    required this.textMuted,
    required this.textDisabled,
    required this.textInverse,
    required this.textLink,
    required this.textLinkHover,
    required this.border,
    required this.borderStrong,
    required this.borderInput,
    required this.borderInputHover,
    required this.borderFocus,
    required this.primary,
    required this.primaryHover,
    required this.primaryActive,
    required this.onPrimary,
    required this.primarySubtle,
    required this.primaryText,
    required this.neutralSolid,
    required this.neutralOnSolid,
    required this.neutralSubtle,
    required this.neutralBorder,
    required this.neutralText,
    required this.neutralTextInverse,
    required this.infoSolid,
    required this.infoOnSolid,
    required this.infoSubtle,
    required this.infoBorder,
    required this.infoText,
    required this.infoTextInverse,
    required this.successSolid,
    required this.successOnSolid,
    required this.successSubtle,
    required this.successBorder,
    required this.successText,
    required this.successTextInverse,
    required this.warningSolid,
    required this.warningOnSolid,
    required this.warningSubtle,
    required this.warningBorder,
    required this.warningText,
    required this.warningTextInverse,
    required this.dangerSolid,
    required this.dangerOnSolid,
    required this.dangerHover,
    required this.dangerActive,
    required this.dangerSubtle,
    required this.dangerBorder,
    required this.dangerText,
    required this.dangerTextInverse,
    required this.switchOff,
    required this.focusRing,
    required this.selectionBg,
    required this.selectionText,
  });

  final Color bg;
  final Color bgSubtle;
  final Color surface;
  final Color surfaceRaised;
  final Color surfaceSunken;
  final Color surfaceHover;
  final Color surfaceActive;
  final Color surfaceInverse;
  final Color scrim;
  final Color raisedBorder;
  final Color text;
  final Color textMuted;
  final Color textDisabled;
  final Color textInverse;
  final Color textLink;
  final Color textLinkHover;
  final Color border;
  final Color borderStrong;
  final Color borderInput;
  final Color borderInputHover;
  final Color borderFocus;
  final Color primary;
  final Color primaryHover;
  final Color primaryActive;
  final Color onPrimary;
  final Color primarySubtle;
  final Color primaryText;
  final Color neutralSolid;
  final Color neutralOnSolid;
  final Color neutralSubtle;
  final Color neutralBorder;
  final Color neutralText;
  final Color neutralTextInverse;
  final Color infoSolid;
  final Color infoOnSolid;
  final Color infoSubtle;
  final Color infoBorder;
  final Color infoText;
  final Color infoTextInverse;
  final Color successSolid;
  final Color successOnSolid;
  final Color successSubtle;
  final Color successBorder;
  final Color successText;
  final Color successTextInverse;
  final Color warningSolid;
  final Color warningOnSolid;
  final Color warningSubtle;
  final Color warningBorder;
  final Color warningText;
  final Color warningTextInverse;
  final Color dangerSolid;
  final Color dangerOnSolid;
  final Color dangerHover;
  final Color dangerActive;
  final Color dangerSubtle;
  final Color dangerBorder;
  final Color dangerText;
  final Color dangerTextInverse;
  final Color switchOff;
  final Color focusRing;
  final Color selectionBg;
  final Color selectionText;

  static const light = KiteColorScheme(
    bg: Color(0xFFF7F4EE),
    bgSubtle: Color(0xFFF1F4F7),
    surface: Color(0xFFFFFFFF),
    surfaceRaised: Color(0xFFFFFFFF),
    surfaceSunken: Color(0xFFF8FAFD),
    surfaceHover: Color(0xFFF1F4F7),
    surfaceActive: Color(0xFFE3E6EC),
    surfaceInverse: Color(0xFF0E1A2B),
    scrim: Color(0x800E1A2B),
    raisedBorder: Color(0x00000000),
    text: Color(0xFF0E1A2B),
    textMuted: Color(0xFF545E6F),
    textDisabled: Color(0xFFA4ABB8),
    textInverse: Color(0xFFEEF2F7),
    textLink: Color(0xFF2858D1),
    textLinkHover: Color(0xFF1E46A8),
    border: Color(0xFFE3E6EC),
    borderStrong: Color(0xFFD0D4DC),
    borderInput: Color(0xFF788190),
    borderInputHover: Color(0xFF545E6F),
    borderFocus: Color(0xFF2E6BFF),
    primary: Color(0xFFFF5A36),
    primaryHover: Color(0xFFFF8265),
    primaryActive: Color(0xFFFFAD98),
    onPrimary: Color(0xFF0E1A2B),
    primarySubtle: Color(0xFFFFF4F1),
    primaryText: Color(0xFF942512),
    neutralSolid: Color(0xFF384355),
    neutralOnSolid: Color(0xFFFFFFFF),
    neutralSubtle: Color(0xFFF1F4F7),
    neutralBorder: Color(0xFFD0D4DC),
    neutralText: Color(0xFF384355),
    neutralTextInverse: Color(0xFFD0D4DC),
    infoSolid: Color(0xFF2858D1),
    infoOnSolid: Color(0xFFFFFFFF),
    infoSubtle: Color(0xFFF3F7FF),
    infoBorder: Color(0xFFC7DAFF),
    infoText: Color(0xFF1E46A8),
    infoTextInverse: Color(0xFFA3C1FF),
    successSolid: Color(0xFF1A8057),
    successOnSolid: Color(0xFFFFFFFF),
    successSubtle: Color(0xFFEEFAF3),
    successBorder: Color(0xFFBBE9D0),
    successText: Color(0xFF116544),
    successTextInverse: Color(0xFF90D9B3),
    warningSolid: Color(0xFFF2A93B),
    warningOnSolid: Color(0xFF0E1A2B),
    warningSubtle: Color(0xFFFDF6EA),
    warningBorder: Color(0xFFFADCAE),
    warningText: Color(0xFF7B4B00),
    warningTextInverse: Color(0xFFF6C57E),
    dangerSolid: Color(0xFFC01242),
    dangerOnSolid: Color(0xFFFFFFFF),
    dangerHover: Color(0xFF902338),
    dangerActive: Color(0xFF6A1626),
    dangerSubtle: Color(0xFFFFF4F4),
    dangerBorder: Color(0xFFFFCCCE),
    dangerText: Color(0xFF902338),
    dangerTextInverse: Color(0xFFFFA9AF),
    switchOff: Color(0xFF788190),
    focusRing: Color(0xFF2E6BFF),
    selectionBg: Color(0xFFE3EDFF),
    selectionText: Color(0xFF0E1A2B),
  );

  static const dark = KiteColorScheme(
    bg: Color(0xFF0B1220),
    bgSubtle: Color(0xFF142033),
    surface: Color(0xFF142033),
    surfaceRaised: Color(0xFF1E2C40),
    surfaceSunken: Color(0xFF0B1220),
    surfaceHover: Color(0xFF222E42),
    surfaceActive: Color(0xFF384355),
    surfaceInverse: Color(0xFFEEF2F7),
    scrim: Color(0x99000000),
    raisedBorder: Color(0xFF222E42),
    text: Color(0xFFEEF2F7),
    textMuted: Color(0xFFA4ABB8),
    textDisabled: Color(0xFF545E6F),
    textInverse: Color(0xFF0E1A2B),
    textLink: Color(0xFF79A4FF),
    textLinkHover: Color(0xFFA3C1FF),
    border: Color(0xFF222E42),
    borderStrong: Color(0xFF384355),
    borderInput: Color(0xFF788190),
    borderInputHover: Color(0xFFA4ABB8),
    borderFocus: Color(0xFF79A4FF),
    primary: Color(0xFFFF5A36),
    primaryHover: Color(0xFFFF8265),
    primaryActive: Color(0xFFFFAD98),
    onPrimary: Color(0xFF0B1220),
    primarySubtle: Color(0xFF4A0C05),
    primaryText: Color(0xFFFFAD98),
    neutralSolid: Color(0xFFD0D4DC),
    neutralOnSolid: Color(0xFF0B1220),
    neutralSubtle: Color(0xFF222E42),
    neutralBorder: Color(0xFF384355),
    neutralText: Color(0xFFD0D4DC),
    neutralTextInverse: Color(0xFF384355),
    infoSolid: Color(0xFF79A4FF),
    infoOnSolid: Color(0xFF0B1220),
    infoSubtle: Color(0xFF0B2158),
    infoBorder: Color(0xFF1E46A8),
    infoText: Color(0xFFA3C1FF),
    infoTextInverse: Color(0xFF1E46A8),
    successSolid: Color(0xFF62C596),
    successOnSolid: Color(0xFF0B1220),
    successSubtle: Color(0xFF022F1D),
    successBorder: Color(0xFF116544),
    successText: Color(0xFF90D9B3),
    successTextInverse: Color(0xFF116544),
    warningSolid: Color(0xFFF2A93B),
    warningOnSolid: Color(0xFF0B1220),
    warningSubtle: Color(0xFF3A1F00),
    warningBorder: Color(0xFF7B4B00),
    warningText: Color(0xFFF6C57E),
    warningTextInverse: Color(0xFF7B4B00),
    dangerSolid: Color(0xFFFFA9AF),
    dangerOnSolid: Color(0xFF0B1220),
    dangerHover: Color(0xFFFFCCCE),
    dangerActive: Color(0xFFFFE6E7),
    dangerSubtle: Color(0xFF490C18),
    dangerBorder: Color(0xFF902338),
    dangerText: Color(0xFFFFA9AF),
    dangerTextInverse: Color(0xFF902338),
    switchOff: Color(0xFF788190),
    focusRing: Color(0xFF79A4FF),
    selectionBg: Color(0xFF13327D),
    selectionText: Color(0xFFEEF2F7),
  );
}

abstract final class KiteRadius {
  static const double none = 0;
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double full = 999;
}

abstract final class KiteSpace {
  static const double unit = 4;
  static double of(int n) => unit * n;
}

abstract final class KiteDuration {
  static const instant = Duration(milliseconds: 0);
  static const fast = Duration(milliseconds: 100);
  static const base = Duration(milliseconds: 150);
  static const moderate = Duration(milliseconds: 200);
  static const slow = Duration(milliseconds: 300);
}

abstract final class KiteText {
  static const display = TextStyle(fontFamily: 'Unbounded', fontSize: 40, height: 1.2, fontWeight: FontWeight.w600, letterSpacing: -0.8);
  static const h1 = TextStyle(fontFamily: 'Unbounded', fontSize: 32, height: 1.25, fontWeight: FontWeight.w600, letterSpacing: -0.48);
  static const h2 = TextStyle(fontFamily: 'Unbounded', fontSize: 24, height: 1.3333, fontWeight: FontWeight.w600, letterSpacing: -0.24);
  static const h3 = TextStyle(fontFamily: 'Unbounded', fontSize: 20, height: 1.4, fontWeight: FontWeight.w500);
  static const h4 = TextStyle(fontFamily: 'Manrope', fontSize: 16, height: 1.5, fontWeight: FontWeight.w700);
  static const body = TextStyle(fontFamily: 'Manrope', fontSize: 16, height: 1.5, fontWeight: FontWeight.w400);
  static const bodyStrong = TextStyle(fontFamily: 'Manrope', fontSize: 16, height: 1.5, fontWeight: FontWeight.w600);
  static const bodySm = TextStyle(fontFamily: 'Manrope', fontSize: 14, height: 1.4286, fontWeight: FontWeight.w400);
  static const label = TextStyle(fontFamily: 'Manrope', fontSize: 14, height: 1.4286, fontWeight: FontWeight.w500);
  static const caption = TextStyle(fontFamily: 'Manrope', fontSize: 12, height: 1.3333, fontWeight: FontWeight.w400, letterSpacing: 0.12);
  static const overline = TextStyle(fontFamily: 'Manrope', fontSize: 12, height: 1.3333, fontWeight: FontWeight.w600, letterSpacing: 0.72);
  static const mono = TextStyle(fontFamily: 'JetBrains Mono', fontSize: 14, height: 1.4286, fontWeight: FontWeight.w500);
  static const monoLg = TextStyle(fontFamily: 'JetBrains Mono', fontSize: 20, height: 1.4, fontWeight: FontWeight.w500, letterSpacing: 0.4);
}
