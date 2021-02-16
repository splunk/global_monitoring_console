# SPDX-FileCopyrightText: 2020 Splunk Inc (AK Khamis) <akhamis@splunk.com>
# SPDX-License-Identifier: Apache-2.0 

import os
import sys
import cherrypy
import splunk.appserver.mrsparkle.controllers as controllers
import splunk.appserver.mrsparkle.lib.util as util

from splunk.appserver.mrsparkle.lib.decorators import expose_page

dir = os.path.join(util.get_apps_dir(), 'global_monitoring_console', 'lib')
if not dir in sys.path:
    sys.path.append(dir)    

import mistune

class markdown(controllers.BaseController):

    @expose_page(must_login=True, methods=['GET']) 
    def easter_egg(self, **kwargs):
        return 'Hello World'

    @expose_page(must_login=True, methods=['GET']) 
    def read(self, appname, filepath, **kwargs):
        filepath = os.path.join(util.get_apps_dir(), appname, filepath)
        if os.path.isfile(filepath):
            data = open(filepath).read()
            html_output = mistune.markdown(data)
            return html_output
        else:
            return "<p>Can´t find specified file: '%s'</p>" % filepath